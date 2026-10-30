import assert from 'node:assert/strict';
import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';

// First reviews of existing legacy identities. Raw snapshots and withheld values remain recoverable.
export function applyProfileReviews(db,root){
  db.exec(`CREATE TABLE fact_assessments(record_id TEXT NOT NULL,key TEXT NOT NULL,batch_id TEXT NOT NULL REFERENCES review_batches(id),status TEXT NOT NULL CHECK(status='unestablished'),note TEXT NOT NULL,checked_at TEXT NOT NULL,PRIMARY KEY(record_id,key),FOREIGN KEY(record_id,key) REFERENCES facts(record_id,key));
    CREATE VIEW published_facts AS SELECT f.record_id,f.key,CASE WHEN f.review_status='unestablished' THEN 'Not established' ELSE f.value END AS value,f.source_id,f.review_status,COALESCE(a.note,'') AS assessment_note FROM facts f LEFT JOIN fact_assessments a ON a.record_id=f.record_id AND a.key=f.key;`);
  const batches=readdirSync(join(root,'data/reviews')).filter(n=>/^profile-\d+\.json$/.test(n)).sort().map(name=>({name,...JSON.parse(readFileSync(join(root,'data/reviews',name),'utf8'))}));
  let profiles=0;
  for(const batch of batches){
    assert.equal(batch.version,1);
    db.prepare('INSERT INTO review_batches VALUES(?,?,?,?)').run(batch.id,batch.checkedAt,batch.reviewer,batch.scope);
    const changes=[];
    for(const s of batch.sources){
      assert.equal(new URL(s.url).protocol,'https:');
      assert.equal(db.prepare('SELECT COUNT(*) AS n FROM sources WHERE url=?').get(s.url).n,0,'Reuse an existing public source instead of duplicating its URL');
      db.prepare('INSERT INTO sources VALUES(?,?,?,?,?,?,?,?,?,?)').run(s.id,s.title,s.url,s.kind,s.checkedAt,s.note,s.license,s.reuseBasis,s.attribution,s.revision);
    }
    // An existing source may gain a newly reviewed scope; keep its identity and prior checked date.
    for(const update of batch.sourceUpdates??[]){
      assert.deepEqual(Object.keys(update).sort(),['expectedNote','id','note']);
      const previous=db.prepare('SELECT * FROM sources WHERE id=?').get(update.id);
      assert.ok(previous,'A source scope update must refer to an existing source');
      assert.equal(previous.note,update.expectedNote,'Do not replace a changed source description silently');
      assert.ok(update.note?.trim());
      db.prepare('UPDATE sources SET note=? WHERE id=?').run(update.note,update.id);
      changes.push({sourceId:update.id,field:'source_description',before:{note:previous.note},after:{note:update.note}});
    }
    const attach=(id,type,key,evidence)=>{
      assert.ok(evidence?.length,'Each assertion or assessment needs its scoped references');
      for(const e of evidence){
        assert.ok(e.locator?.trim());
        db.prepare('INSERT OR IGNORE INTO record_sources VALUES(?,?)').run(id,e.sourceId);
        db.prepare('INSERT INTO citations(record_id,subject_type,subject_key,source_id,locator,note,checked_at) VALUES(?,?,?,?,?,?,?)').run(id,type,key,e.sourceId,e.locator,e.note??'',batch.checkedAt);
      }
    };
    for(const r of batch.records){
      const original=db.prepare('SELECT * FROM records WHERE id=?').get(r.id);
      assert.ok(original?.legacy_id,'Profile review must preserve an existing numeric legacy identity');
      assert.equal(db.prepare('SELECT COUNT(*) AS n FROM record_reviews WHERE record_id=?').get(r.id).n,0,'Later changes need a separate supplement rather than replacing a first review');
      const oldFacts=db.prepare('SELECT * FROM facts WHERE record_id=? ORDER BY key').all(r.id);
      const keys=[...r.facts.map(f=>f.key),...r.factAssessments.map(f=>f.key)];
      assert.equal(keys.length,new Set(keys).size,'A field cannot be both verified and unestablished');
      for(const f of oldFacts){assert.ok(keys.includes(f.key),'Every inherited field must have an explicit outcome');assert.equal(f.review_status,'legacy');}
      assert.deepEqual(Object.keys(r.metadata).sort(),['continuity','era','evidence']);
      db.prepare('UPDATE records SET summary=?,era=?,continuity=? WHERE id=?').run(r.summary.text,r.metadata.era,r.metadata.continuity,r.id);
      changes.push({recordId:r.id,field:'profile',before:original,after:{summary:r.summary.text,era:r.metadata.era,continuity:r.metadata.continuity}});
      db.prepare('INSERT INTO record_reviews VALUES(?,?,?,?,?,0)').run(r.id,batch.id,batch.checkedAt,r.scope,JSON.stringify(r.limitations));
      attach(r.id,'summary','summary',r.summary.evidence);
      for(const key of ['era','continuity'])attach(r.id,'record_metadata',key,r.metadata.evidence);
      for(const f of r.facts){
        const before=db.prepare('SELECT * FROM facts WHERE record_id=? AND key=?').get(r.id,f.key)??null;
        assert.equal(before?.value??null,f.expectedValue);
        db.prepare("INSERT INTO facts VALUES(?,?,?,?,?) ON CONFLICT(record_id,key) DO UPDATE SET value=excluded.value,source_id=excluded.source_id,review_status=excluded.review_status").run(r.id,f.key,f.value,f.evidence[0].sourceId,'verified');
        attach(r.id,'fact',f.key,f.evidence);
        changes.push({recordId:r.id,field:f.key,before,after:{value:f.value,reviewStatus:'verified',evidence:f.evidence}});
      }
      for(const f of r.factAssessments){
        const before=db.prepare('SELECT * FROM facts WHERE record_id=? AND key=?').get(r.id,f.key);
        assert.equal(before?.value,f.expectedValue);assert.equal(before?.source_id,f.expectedSourceId);assert.equal(f.status,'unestablished');
        db.prepare("UPDATE facts SET review_status='unestablished' WHERE record_id=? AND key=?").run(r.id,f.key);
        db.prepare('INSERT INTO fact_assessments VALUES(?,?,?,?,?,?)').run(r.id,f.key,batch.id,f.status,f.note,batch.checkedAt);
        attach(r.id,'fact_assessment',f.key,f.evidence);
        changes.push({recordId:r.id,field:f.key,before,after:{reviewStatus:f.status,publishedValue:'Not established',rawValuePreserved:true,note:f.note}});
      }
      for(const l of r.links){
        const before=db.prepare('SELECT * FROM links WHERE record_id=? AND target_id=? AND relation=?').get(r.id,l.targetId,l.relation)??null;
        assert.notEqual(before?.review_status,'verified','Retain earlier verified links rather than overwriting their evidence');
        db.prepare("INSERT INTO links VALUES(?,?,?,?,?) ON CONFLICT(record_id,target_id,relation) DO UPDATE SET source_id=excluded.source_id,review_status=excluded.review_status").run(r.id,l.targetId,l.relation,l.evidence[0].sourceId,'verified');
        attach(r.id,'link',`${r.id}|${l.targetId}|${l.relation}`,l.evidence);
        for(const e of l.evidence)db.prepare('INSERT OR IGNORE INTO record_sources VALUES(?,?)').run(l.targetId,e.sourceId);
        changes.push({recordId:r.id,field:'link',before,after:l});
      }
      // Incoming verified links already have evidence; expose their sources on this reviewed profile too.
      const related=db.prepare("SELECT record_id,target_id,relation FROM links WHERE review_status='verified' AND (record_id=? OR target_id=?)").all(r.id,r.id);
      for(const l of related){const cites=db.prepare("SELECT source_id FROM citations WHERE record_id=? AND subject_type='link' AND subject_key=?").all(l.record_id,`${l.record_id}|${l.target_id}|${l.relation}`);for(const c of cites)db.prepare('INSERT OR IGNORE INTO record_sources VALUES(?,?)').run(r.id,c.source_id);}
      profiles++;
    }
    writeFileSync(join(root,'data/reviews',batch.name.replace('.json','-change-log.json')),JSON.stringify({batch:batch.id,checkedAt:batch.checkedAt,changes},null,2)+'\n');
  }
  return {profileBatches:batches.length,reviewedLegacyProfiles:profiles,unestablishedFields:db.prepare('SELECT COUNT(*) AS n FROM fact_assessments').get().n};
}
