import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const editionInputFiles=['original-trilogy-editions.json','films-02-editions.json','films-03-editions.json','screen-04-editions.json','screen-05-editions.json'];

export function applyEditions(db,root){
  db.exec(`
    CREATE TABLE film_editions(id TEXT PRIMARY KEY,record_id TEXT NOT NULL REFERENCES records(id),label TEXT NOT NULL,year INTEGER NOT NULL,kind TEXT NOT NULL CHECK(kind IN ('original','revision')),summary TEXT NOT NULL,scope_note TEXT NOT NULL);
    CREATE TABLE release_events(id TEXT PRIMARY KEY,record_id TEXT NOT NULL REFERENCES records(id),edition_id TEXT REFERENCES film_editions(id),date TEXT NOT NULL,date_end TEXT,territory TEXT NOT NULL,medium TEXT NOT NULL CHECK(medium IN ('Theatrical','Television','Streaming')),event_type TEXT NOT NULL,status TEXT NOT NULL CHECK(status IN ('released','superseded')),label TEXT NOT NULL,note TEXT NOT NULL);
    CREATE INDEX release_events_edition ON release_events(edition_id,date);
    CREATE INDEX release_events_record ON release_events(record_id,date);
    CREATE TABLE edition_credits(id TEXT PRIMARY KEY,edition_id TEXT NOT NULL REFERENCES film_editions(id),contributor_id TEXT NOT NULL REFERENCES contributors(id),role TEXT NOT NULL,position INTEGER NOT NULL);
    ALTER TABLE credits ADD COLUMN edition_id TEXT REFERENCES film_editions(id);
  `);
  const ref=db.prepare('INSERT OR IGNORE INTO record_sources VALUES(?,?)');
  const cite=db.prepare('INSERT INTO citations(record_id,subject_type,subject_key,source_id,locator,note,checked_at) VALUES(?,?,?,?,?,?,?)');
  const changes=[];
  for(const file of editionInputFiles){
    const input=JSON.parse(readFileSync(join(root,'data/reviews',file),'utf8'));
    if(input.version!==1)throw new Error('Unsupported edition input format');
    const attach=(record,type,key,evidence)=>{
      if(!evidence?.length)throw new Error(`Edition evidence missing: ${key}`);
      for(const e of evidence){
        if(!e.locator?.trim())throw new Error(`Edition source location missing: ${key}`);
        ref.run(record,e.sourceId);cite.run(record,type,key,e.sourceId,e.locator,e.note??'',input.checkedAt);
      }
    };
    const screenOwner=record=>{
      if(!['films','series'].includes(db.prepare('SELECT category FROM records WHERE id=?').get(record)?.category))throw new Error('Edition/release owner must be a screen production');
    };
    const insertRelease=(record,edition,r)=>{
      screenOwner(record);
      if(edition&&db.prepare('SELECT record_id FROM film_editions WHERE id=?').get(edition)?.record_id!==record)throw new Error('Release edition belongs to a different work');
      for(const date of [r.date,...(r.dateEnd?[r.dateEnd]:[])])if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||new Date(date).toISOString().slice(0,10)!==date)throw new Error('Release needs a valid scoped date');
      if(r.dateEnd&&r.dateEnd<r.date)throw new Error('Event range ends before it starts');
      db.prepare('INSERT INTO release_events VALUES(?,?,?,?,?,?,?,?,?,?,?)').run(r.id,record,edition,r.date,r.dateEnd??null,r.territory,r.medium,r.eventType,r.status,r.label??'Theatrical release',r.note);
      attach(record,'release',r.id,r.evidence);
    };
    for(const s of input.sources){
      if(new URL(s.url).protocol!=='https:')throw new Error('Edition source requires HTTPS');
      db.prepare('INSERT INTO sources(id,title,url,kind,checked_at,note,license,reuse_basis,attribution,revision) VALUES(?,?,?,?,?,?,?,?,?,?)').run(s.id,s.title,s.url,s.kind,s.checkedAt,s.note,s.license,s.reuseBasis,s.attribution,s.revision);
    }
    for(const e of input.editions){
      screenOwner(e.recordId);
      db.prepare('INSERT INTO film_editions VALUES(?,?,?,?,?,?,?)').run(e.id,e.recordId,e.label,e.year,e.kind,e.summary,e.scopeNote);
      attach(e.recordId,'edition',e.id,e.evidence);
      if(e.inheritOriginalCredits){
        if(e.kind!=='original')throw new Error('Original credits cannot silently become revision credits');
        db.prepare("UPDATE credits SET edition_id=? WHERE record_id=? AND scope LIKE 'Original %'").run(e.id,e.recordId);
      }
      for(const r of e.releases)insertRelease(e.recordId,e.id,r);
      for(const [position,c] of e.credits.entries()){
        const id=c.person.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
        db.prepare('INSERT OR IGNORE INTO contributors VALUES(?,?)').run(id,c.person);
        const creditId=`${e.id}:${position}`;
        db.prepare('INSERT INTO edition_credits VALUES(?,?,?,?,?)').run(creditId,e.id,id,c.role,position);
        attach(e.recordId,'edition_credit',creditId,c.evidence);
      }
    }
    // Availability can be proven without identifying the supplied edit/master.
    for(const r of input.releases??[])insertRelease(r.recordId,r.editionId??null,r);
    for(const f of input.facts){
      const before=db.prepare('SELECT value,source_id,review_status FROM facts WHERE record_id=? AND key=?').get(f.recordId,f.key);
      changes.push({input:input.id,recordId:f.recordId,field:f.key,before,after:f.value,evidence:f.evidence});
      db.prepare('INSERT INTO facts VALUES(?,?,?,?,?) ON CONFLICT(record_id,key) DO UPDATE SET value=excluded.value,source_id=excluded.source_id,review_status=excluded.review_status').run(f.recordId,f.key,f.value,f.evidence[0].sourceId,'verified');
      db.prepare("DELETE FROM citations WHERE record_id=? AND subject_type='fact' AND subject_key=?").run(f.recordId,f.key);
      attach(f.recordId,'fact',f.key,f.evidence);
    }
  }
  writeFileSync(join(root,'data/reviews/edition-change-log.json'),JSON.stringify(changes,null,2)+'\n');
  return {editions:db.prepare('SELECT COUNT(*) AS n FROM film_editions').get().n,releases:db.prepare('SELECT COUNT(*) AS n FROM release_events').get().n,editionCredits:db.prepare('SELECT COUNT(*) AS n FROM edition_credits').get().n};
}
