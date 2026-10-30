import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export function applySupplements(db, root, {afterBatch} = {}) {
  const batches = readdirSync(join(root,'data/reviews')).filter(name=>/^supplement-\d+\.json$/.test(name)).sort().map(name=>({name,...JSON.parse(readFileSync(join(root,'data/reviews',name),'utf8'))}));
  db.exec(`
    CREATE TABLE review_supplements(record_id TEXT NOT NULL REFERENCES records(id),batch_id TEXT NOT NULL REFERENCES review_batches(id),scope TEXT NOT NULL,PRIMARY KEY(record_id,batch_id));
    CREATE TABLE episodes(id TEXT PRIMARY KEY,record_id TEXT NOT NULL REFERENCES records(id),season INTEGER NOT NULL CHECK(season>0),number_start INTEGER NOT NULL CHECK(number_start>0),number_end INTEGER NOT NULL CHECK(number_end>=number_start),title TEXT NOT NULL,source_label TEXT NOT NULL,note TEXT NOT NULL,UNIQUE(record_id,season,number_start));
    CREATE TABLE episode_credits(id TEXT PRIMARY KEY,episode_id TEXT NOT NULL REFERENCES episodes(id),contributor_id TEXT NOT NULL REFERENCES contributors(id),role TEXT NOT NULL,credit_line TEXT NOT NULL,position INTEGER NOT NULL);
    CREATE TABLE episode_links(id TEXT PRIMARY KEY,episode_id TEXT NOT NULL REFERENCES episodes(id),target_id TEXT NOT NULL REFERENCES records(id),relation TEXT NOT NULL CHECK(relation IN ('appearance','setting','featured_ship')),note TEXT NOT NULL,representation TEXT NOT NULL DEFAULT 'unspecified' CHECK(representation IN ('unspecified','direct','flashback','transmission','force_spirit','vision','force_communication')),UNIQUE(episode_id,target_id,relation));
    CREATE TABLE episode_reviews(episode_id TEXT PRIMARY KEY REFERENCES episodes(id),batch_id TEXT NOT NULL REFERENCES review_batches(id),checked_at TEXT NOT NULL,scope TEXT NOT NULL,considered_targets TEXT NOT NULL,notes TEXT NOT NULL);
    CREATE INDEX episodes_record ON episodes(record_id,season,number_start);
  `);
  for (const batch of batches) {
  if(batch.version!==1)throw new Error('Unsupported supplement format');
  db.prepare('INSERT INTO review_batches VALUES(?,?,?,?)').run(batch.id,batch.checkedAt,batch.reviewer,batch.scope);
  const changes=[];
  const attach=(recordId,type,key,evidence)=>{
    if(!evidence?.length)throw new Error(`Missing supplementary evidence: ${recordId}/${type}/${key}`);
    for(const item of evidence){
      if(!item.locator?.trim())throw new Error('Empty supplementary locator');
      db.prepare('INSERT OR IGNORE INTO record_sources VALUES(?,?)').run(recordId,item.sourceId);
      db.prepare('INSERT INTO citations(record_id,subject_type,subject_key,source_id,locator,note,checked_at) VALUES(?,?,?,?,?,?,?)').run(recordId,type,key,item.sourceId,item.locator,item.note??'',batch.checkedAt);
    }
  };
  const personId=name=>{
    const existing=db.prepare('SELECT id FROM contributors WHERE name=?').get(name);
    if(existing)return existing.id;
    const id=name.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    db.prepare('INSERT INTO contributors VALUES(?,?)').run(id,name);return id;
  };
  for(const s of batch.sources){
    if(new URL(s.url).protocol!=='https:')throw new Error('Supplement sources require HTTPS');
    db.prepare('INSERT INTO sources VALUES(?,?,?,?,?,?,?,?,?,?)').run(s.id,s.title,s.url,s.kind,s.checkedAt,s.note,s.license,s.reuseBasis,s.attribution,s.revision);
  }
  for(const update of batch.sourceUpdates??[]){
    const previous=db.prepare('SELECT * FROM sources WHERE id=?').get(update.id);
    if(!previous)throw new Error(`Unknown source update ${update.id}`);
    db.prepare('UPDATE sources SET title=?,note=? WHERE id=?').run(update.title??previous.title,update.note??previous.note,update.id);
    changes.push({sourceId:update.id,field:'source_description',before:{title:previous.title,note:previous.note},after:{title:update.title??previous.title,note:update.note??previous.note}});
  }
  for(const record of batch.records.filter(r=>r.newRecord)){
    const r=record.newRecord;
    db.prepare('INSERT INTO records VALUES(?,?,?,?,?,?,?,?,?,?)').run(record.id,r.category,null,r.slug,r.title,record.summary.text,r.year,r.era,r.continuity,'editorial');
    db.prepare('INSERT INTO record_reviews VALUES(?,?,?,?,?,0)').run(record.id,batch.id,batch.checkedAt,record.scope,JSON.stringify(record.limitations));
    attach(record.id,'summary','summary',record.summary.evidence);
  }
  for(const record of batch.records){
    db.prepare('INSERT INTO review_supplements VALUES(?,?,?)').run(record.id,batch.id,record.scope);
    const before=db.prepare('SELECT limitations FROM record_reviews WHERE record_id=?').get(record.id);
    if(!before)throw new Error(`Supplement requires an existing review: ${record.id}`);
    db.prepare('UPDATE record_reviews SET checked_at=?,limitations=? WHERE record_id=?').run(batch.checkedAt,JSON.stringify(record.limitations),record.id);
    changes.push({recordId:record.id,field:'limitations',before:JSON.parse(before.limitations),after:record.limitations});
    for(const f of record.facts){
      const previous=db.prepare('SELECT * FROM facts WHERE record_id=? AND key=?').get(record.id,f.key)??null;
      changes.push({recordId:record.id,field:f.key,before:previous,after:f});
      db.prepare('INSERT INTO facts VALUES(?,?,?,?,?) ON CONFLICT(record_id,key) DO UPDATE SET value=excluded.value,source_id=excluded.source_id,review_status=excluded.review_status').run(record.id,f.key,f.value,f.evidence[0].sourceId,'verified');
      db.prepare("DELETE FROM citations WHERE record_id=? AND subject_type='fact' AND subject_key=?").run(record.id,f.key);
      attach(record.id,'fact',f.key,f.evidence);
    }
    for(const c of record.creditUpdates){
      const previous=db.prepare('SELECT * FROM credits WHERE id=? AND record_id=?').get(c.id,record.id);
      if(!previous)throw new Error(`Unknown existing credit ${c.id}`);
      changes.push({recordId:record.id,field:'credit',before:previous,after:c});
      if(c.characterRecordId && !db.prepare("SELECT 1 FROM records WHERE id=? AND category='people'").get(c.characterRecordId))throw new Error(`Unknown character profile ${c.characterRecordId}`);
      db.prepare('UPDATE credits SET scope=?,note=?,character_record_id=COALESCE(?,character_record_id) WHERE id=?').run(c.scope,c.note,c.characterRecordId??null,c.id);
      db.prepare("DELETE FROM citations WHERE record_id=? AND subject_type='credit' AND subject_key=?").run(record.id,c.id);
      attach(record.id,'credit',c.id,c.evidence);
    }
    for(const [i,c] of record.credits.entries()){
      const id=`${batch.id}:${record.id}:${i}`;
      if(c.characterRecordId && !db.prepare("SELECT 1 FROM records WHERE id=? AND category='people'").get(c.characterRecordId))throw new Error(`Unknown character profile ${c.characterRecordId}`);
      const position=db.prepare('SELECT COALESCE(MAX(position),-1)+1 AS n FROM credits WHERE record_id=?').get(record.id).n;
      db.prepare('INSERT INTO credits(id,record_id,contributor_id,role,character_name,character_record_id,scope,note,position,edition_id) VALUES(?,?,?,?,?,?,?,?,?,NULL)').run(id,record.id,personId(c.person),c.role,c.characterName??'',c.characterRecordId??null,c.scope,c.note??'',position);
      attach(record.id,'credit',id,c.evidence);
    }
    for(const resolution of record.resolutions){
      const issues=db.prepare("SELECT id,note FROM review_issues WHERE record_id=? AND field=? AND status='pending'").all(record.id,resolution.field);
      if(!issues.length)throw new Error(`No open issue to resolve: ${record.id}/${resolution.field}`);
      for(const issue of issues){db.prepare('UPDATE review_issues SET status=?,note=? WHERE id=?').run('resolved',`${issue.note} Resolved by ${batch.id}: ${resolution.note}`,issue.id);changes.push({recordId:record.id,field:resolution.field,before:issue.note,after:resolution.note});}
    }
    for(const l of record.links??[]){
      db.prepare('INSERT INTO links VALUES(?,?,?,?,?) ON CONFLICT(record_id,target_id,relation) DO UPDATE SET source_id=excluded.source_id,review_status=excluded.review_status').run(record.id,l.targetId,l.relation,l.evidence[0].sourceId,'verified');
      const key=`${record.id}|${l.targetId}|${l.relation}`;
      db.prepare("DELETE FROM citations WHERE record_id=? AND subject_type='link' AND subject_key=?").run(record.id,key);
      attach(record.id,'link',key,l.evidence);
      // Related connections are shown on both dossiers; their cited sources must resolve on both.
      for(const e of l.evidence)db.prepare('INSERT OR IGNORE INTO record_sources VALUES(?,?)').run(l.targetId,e.sourceId);
    }
    for(const review of record.episodeReviews??[]){
      if(!db.prepare('SELECT 1 FROM episodes WHERE id=? AND record_id=?').get(review.episodeId,record.id))throw new Error('Episode review belongs to a different series');
      if(new Set(review.consideredTargets).size!==review.consideredTargets.length)throw new Error('Duplicate profile in episode review cohort');
      for(const target of review.consideredTargets)if(!db.prepare('SELECT 1 FROM records WHERE id=?').get(target))throw new Error(`Unknown reviewed target ${target}`);
      db.prepare('INSERT INTO episode_reviews VALUES(?,?,?,?,?,?)').run(review.episodeId,batch.id,batch.checkedAt,review.scope,JSON.stringify(review.consideredTargets),JSON.stringify(review.notes));
      attach(record.id,'episode_review',review.episodeId,review.evidence);
      for(const [i,l] of review.links.entries()){
        if(!review.consideredTargets.includes(l.targetId))throw new Error('Episode connection outside stated cohort');
        const previous=db.prepare('SELECT * FROM episode_links WHERE episode_id=? AND target_id=? AND relation=?').get(review.episodeId,l.targetId,l.relation);
        const id=previous?.id??`${batch.id}:${review.episodeId}:link:${i}`;
        db.prepare('INSERT INTO episode_links(id,episode_id,target_id,relation,note,representation) VALUES(?,?,?,?,?,?) ON CONFLICT(episode_id,target_id,relation) DO UPDATE SET note=excluded.note,representation=excluded.representation').run(id,review.episodeId,l.targetId,l.relation,l.note,l.representation);
        db.prepare("DELETE FROM citations WHERE record_id=? AND subject_type='episode_link' AND subject_key=?").run(record.id,id);
        attach(record.id,'episode_link',id,l.evidence);
        changes.push({recordId:record.id,field:'episode_link',episodeId:review.episodeId,before:previous??null,after:l});
      }
    }
    for(const e of record.episodes){
      db.prepare('INSERT INTO episodes VALUES(?,?,?,?,?,?,?,?)').run(e.id,record.id,e.season,e.start,e.end,e.title,e.sourceLabel,e.note);
      attach(record.id,'episode',e.id,e.evidence);
      for(const [i,c] of e.credits.entries()){
        const id=`${e.id}:credit:${i}`;
        db.prepare('INSERT INTO episode_credits VALUES(?,?,?,?,?,?)').run(id,e.id,personId(c.person),c.role,c.creditLine,i);
        attach(record.id,'episode_credit',id,c.evidence);
      }
      for(const [i,l] of e.links.entries()){
        const id=`${e.id}:link:${i}`;
        db.prepare('INSERT INTO episode_links(id,episode_id,target_id,relation,note) VALUES(?,?,?,?,?)').run(id,e.id,l.targetId,l.relation,l.note);
        attach(record.id,'episode_link',id,l.evidence);
      }
    }
  }
  writeFileSync(join(root,'data/reviews',batch.name.replace('.json','-change-log.json')),JSON.stringify(changes,null,2)+'\n');
  afterBatch?.(batch);
  }
  return {supplementBatches:batches.length,episodeReviews:db.prepare('SELECT COUNT(*) AS n FROM episode_reviews').get().n,episodeEntries:db.prepare('SELECT COUNT(*) AS n FROM episodes').get().n,episodeParts:db.prepare('SELECT SUM(number_end-number_start+1) AS n FROM episodes').get().n,episodeCredits:db.prepare('SELECT COUNT(*) AS n FROM episode_credits').get().n,episodeLinks:db.prepare('SELECT COUNT(*) AS n FROM episode_links').get().n};
}
