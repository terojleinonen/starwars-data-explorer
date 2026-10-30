import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { applyProfileReviews } from './apply-profile-reviews.mjs';
import { applySupplements } from './apply-supplements.mjs';
import { applyEditions } from './apply-editions.mjs';

// Reviewed inputs are additive overlays. Legacy snapshots are never rewritten.
export function applyReviews(db, root, {afterSupplement} = {}) {
  db.exec(`
    ALTER TABLE sources ADD COLUMN license TEXT NOT NULL DEFAULT 'Not assessed';
    ALTER TABLE sources ADD COLUMN reuse_basis TEXT NOT NULL DEFAULT '';
    ALTER TABLE sources ADD COLUMN attribution TEXT NOT NULL DEFAULT '';
    ALTER TABLE sources ADD COLUMN revision TEXT NOT NULL DEFAULT '';
    CREATE TABLE review_batches(id TEXT PRIMARY KEY,checked_at TEXT NOT NULL,reviewer TEXT NOT NULL,scope TEXT NOT NULL);
    CREATE TABLE record_reviews(record_id TEXT PRIMARY KEY REFERENCES records(id),batch_id TEXT NOT NULL REFERENCES review_batches(id),checked_at TEXT NOT NULL,scope TEXT NOT NULL,limitations TEXT NOT NULL,is_primary INTEGER NOT NULL);
    CREATE TABLE contributors(id TEXT PRIMARY KEY,name TEXT NOT NULL UNIQUE);
    CREATE TABLE credits(id TEXT PRIMARY KEY,record_id TEXT NOT NULL REFERENCES records(id),contributor_id TEXT NOT NULL REFERENCES contributors(id),role TEXT NOT NULL,character_name TEXT NOT NULL,character_record_id TEXT REFERENCES records(id),scope TEXT NOT NULL,note TEXT NOT NULL,position INTEGER NOT NULL);
    CREATE INDEX credits_record ON credits(record_id,position);
    CREATE TABLE citations(id INTEGER PRIMARY KEY,record_id TEXT NOT NULL REFERENCES records(id),subject_type TEXT NOT NULL CHECK(subject_type IN ('summary','fact','credit','link','edition','release','edition_credit','episode','episode_credit','episode_link','episode_review','fact_assessment','record_metadata')),subject_key TEXT NOT NULL,source_id TEXT NOT NULL REFERENCES sources(id),locator TEXT NOT NULL,note TEXT NOT NULL,checked_at TEXT NOT NULL);
    CREATE INDEX citations_subject ON citations(record_id,subject_type,subject_key);
    CREATE TABLE review_issues(id INTEGER PRIMARY KEY,record_id TEXT NOT NULL REFERENCES records(id),batch_id TEXT NOT NULL REFERENCES review_batches(id),field TEXT NOT NULL,status TEXT NOT NULL,note TEXT NOT NULL);
  `);
  const batches = readdirSync(join(root,'data/reviews')).filter(name=>/^pilot-\d+\.json$/.test(name)).sort().map(name=>JSON.parse(readFileSync(join(root,'data/reviews',name),'utf8')));
  const reference = db.prepare('INSERT OR IGNORE INTO record_sources VALUES(?,?)');
  const cite = db.prepare('INSERT INTO citations(record_id,subject_type,subject_key,source_id,locator,note,checked_at) VALUES(?,?,?,?,?,?,?)');
  const changes = [];
  const attach = (recordId,type,key,evidence,date) => {
    if (!evidence?.length) throw new Error(`Missing evidence: ${recordId}/${type}/${key}`);
    for (const item of evidence) {
      if (!item.locator?.trim()) throw new Error(`Missing source locator: ${recordId}/${key}`);
      reference.run(recordId,item.sourceId);
      cite.run(recordId,type,key,item.sourceId,item.locator,item.note??'',date);
    }
  };
  for (const batch of batches) {
    if (batch.version!==1) throw new Error('Unsupported review format');
    db.prepare('INSERT INTO review_batches VALUES(?,?,?,?)').run(batch.id,batch.checkedAt,batch.reviewer,batch.scope);
    for (const s of batch.sources) {
      if (new URL(s.url).protocol!=='https:') throw new Error('Review sources require HTTPS');
      db.prepare('INSERT INTO sources(id,title,url,kind,checked_at,note,license,reuse_basis,attribution,revision) VALUES(?,?,?,?,?,?,?,?,?,?)').run(s.id,s.title,s.url,s.kind,s.checkedAt,s.note,s.license,s.reuseBasis,s.attribution,s.revision);
    }
    // Register supporting entities first so every credit and connection has a real target.
    for (const entry of batch.records.filter(entry=>entry.newRecord)) {
      const r=entry.newRecord;
      db.prepare('INSERT INTO records VALUES(?,?,?,?,?,?,?,?,?,?)').run(entry.id,r.category,null,r.slug,r.title,'',r.year,r.era,r.continuity,'editorial');
    }
    for (const entry of batch.records) {
      const current=db.prepare('SELECT * FROM records WHERE id=?').get(entry.id);
      if (!current) throw new Error(`Unknown reviewed record: ${entry.id}`);
      changes.push({batch:batch.id,recordId:entry.id,field:'summary',before:current.summary,after:entry.summary.text});
      db.prepare('UPDATE records SET summary=? WHERE id=?').run(entry.summary.text,entry.id);
      attach(entry.id,'summary','summary',entry.summary.evidence,batch.checkedAt);
      db.prepare('INSERT OR REPLACE INTO record_reviews VALUES(?,?,?,?,?,?)').run(entry.id,batch.id,batch.checkedAt,entry.review.scope,JSON.stringify(entry.review.limitations),entry.primary?1:0);
      for (const f of entry.facts) {
        const before=db.prepare('SELECT value,source_id,review_status FROM facts WHERE record_id=? AND key=?').get(entry.id,f.key);
        changes.push({batch:batch.id,recordId:entry.id,field:f.key,before:before??null,after:{value:f.value,sourceIds:f.evidence.map(e=>e.sourceId),reviewStatus:'verified'}});
        db.prepare('INSERT INTO facts VALUES(?,?,?,?,?) ON CONFLICT(record_id,key) DO UPDATE SET value=excluded.value,source_id=excluded.source_id,review_status=excluded.review_status').run(entry.id,f.key,f.value,f.evidence[0].sourceId,'verified');
        db.prepare("DELETE FROM citations WHERE record_id=? AND subject_type='fact' AND subject_key=?").run(entry.id,f.key);
        attach(entry.id,'fact',f.key,f.evidence,batch.checkedAt);
      }
      for (const [position,c] of entry.credits.entries()) {
        const contributorId=c.person.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
        db.prepare('INSERT OR IGNORE INTO contributors VALUES(?,?)').run(contributorId,c.person);
        const creditId=`${batch.id}:${entry.id}:${position}`;
        db.prepare('INSERT INTO credits VALUES(?,?,?,?,?,?,?,?,?)').run(creditId,entry.id,contributorId,c.role,c.characterName,c.characterRecordId,c.scope,c.note,position);
        attach(entry.id,'credit',creditId,c.evidence,batch.checkedAt);
      }
      for (const l of entry.links) {
        db.prepare('INSERT INTO links VALUES(?,?,?,?,?) ON CONFLICT(record_id,target_id,relation) DO UPDATE SET source_id=excluded.source_id,review_status=excluded.review_status').run(entry.id,l.targetId,l.relation,l.evidence[0].sourceId,'verified');
        const key=`${entry.id}|${l.targetId}|${l.relation}`;
        db.prepare("DELETE FROM citations WHERE record_id=? AND subject_type='link' AND subject_key=?").run(entry.id,key);
        attach(entry.id,'link',key,l.evidence,batch.checkedAt);
        for (const evidence of l.evidence) reference.run(l.targetId,evidence.sourceId);
      }
    }
    for (const issue of batch.issues) db.prepare('INSERT INTO review_issues(record_id,batch_id,field,status,note) VALUES(?,?,?,?,?)').run(issue.recordId,batch.id,issue.field,issue.status,issue.note);
  }
  writeFileSync(join(root,'data/reviews/change-log.json'),JSON.stringify(changes,null,2)+'\n');
  const editionStats=applyEditions(db,root);
  const supplementStats=applySupplements(db,root,{afterBatch:afterSupplement});
  const profileStats=applyProfileReviews(db,root);
  return { ...editionStats, ...supplementStats, ...profileStats, batches:batches.length,primaryRecords:db.prepare('SELECT COUNT(*) AS n FROM record_reviews WHERE is_primary=1').get().n,supportingRecords:db.prepare('SELECT COUNT(*) AS n FROM record_reviews WHERE is_primary=0').get().n,credits:db.prepare('SELECT COUNT(*) AS n FROM credits').get().n,citations:db.prepare('SELECT COUNT(*) AS n FROM citations').get().n };
}
