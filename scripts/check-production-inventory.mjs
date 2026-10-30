import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';

export function checkProductionInventory(root,db){
  const inventory=JSON.parse(readFileSync(join(root,'data/catalogue/production-inventory.json'),'utf8'));
  const plan=JSON.parse(readFileSync(join(root,'data/reviews/review-plan-01.json'),'utf8'));
  assert.equal(inventory.version,1);
  const ids=new Set(inventory.works.map(w=>w.id));
  assert.equal(ids.size,inventory.works.length,'Catalogue identities must be unique');
  const sources=new Set(inventory.sources.map(s=>s.id));
  assert.equal(sources.size,inventory.sources.length);
  for(const source of inventory.sources){assert.equal(new URL(source.url).protocol,'https:');assert.ok(source.checkedAt&&source.reuseBasis);}
  const evidence=items=>{assert.ok(items.length,'Catalogue identity needs an evidence locator');for(const e of items){assert.ok(sources.has(e.sourceId));assert.ok(e.locator.trim());}};
  for(const work of inventory.works){
    assert.ok(work.title&&work.format&&work.era&&work.continuity.label);
    evidence(work.evidence);
    for(const e of work.continuity.evidence??[])evidence([e]);
    const release=work.originalUsRelease;
    if(release.date){
      const expression={day:/^\d{4}-\d{2}-\d{2}$/,month:/^\d{4}-\d{2}$/,year:/^\d{4}$/}[release.precision];
      assert.ok(expression?.test(release.date),'Do not invent day precision for a month/year source');
      assert.ok(release.date<=inventory.checkedAt,'An original release cannot be in the future');
      evidence(release.evidence);
    }
    if(work.relation)assert.ok(ids.has(work.relation.parentId),'A component needs a known parent');
    if(work.unit==='component')assert.ok(work.relation);
    if(work.publicationStatus==='announced'){assert.equal(work.originalUsRelease.date,null);assert.equal(work.archiveStatus,'not_yet_released');}
    if(work.archiveStatus==='included'){
      const row=db.prepare('SELECT title FROM records WHERE id=?').get(work.recordId);
      assert.equal(row?.title,work.title);
      for(const [key,value] of [['release_date',release.date],['format',work.format]])assert.equal(db.prepare('SELECT value FROM facts WHERE record_id=? AND key=?').get(work.recordId,key)?.value,value);
    }else assert.equal(work.recordId,null,'Missing and announced entries must not pretend to be published records');
  }
  const included=inventory.works.filter(w=>w.archiveStatus==='included');
  const screenIds=db.prepare("SELECT id FROM records WHERE category IN ('films','series') ORDER BY id").all().map(r=>r.id);
  assert.deepEqual(included.map(w=>w.recordId).sort(),screenIds,'Every current work must be reconciled');
  for(const queue of inventory.queue){assert.ok(queue.ids.length<=10);for(const id of queue.ids){assert.ok(ids.has(id));assert.equal(inventory.works.find(w=>w.id===id).archiveStatus,'missing');}}
  const ninth=inventory.works.find(w=>w.id==='catalogue:ninth-jedi');
  assert.equal(ninth.originalUsRelease.date,'2026-08-05');
  assert.equal(ninth.unit,'work','The 2026 series is distinct from the earlier anthology short');
  assert.equal(inventory.works.find(w=>w.id==='catalogue:young-jedi-adventures').originalUsRelease.date,'2023-05-04');
  assert.equal(inventory.works.find(w=>w.id==='catalogue:visions').originalUsRelease.date,'2021-09-22');
  for(const announcement of inventory.announcements){evidence(announcement.evidence);assert.notEqual(announcement.status,'released');}
  for(const conflict of inventory.conflicts){for(const e of conflict.evidence??[])evidence([e]);}
  for(const update of plan.issueUpdates){
    const row=db.prepare('SELECT field,status,note FROM review_issues WHERE record_id=? AND field=?').get(update.recordId,update.newField);
    assert.deepEqual({...row},{field:update.newField,status:update.status,note:update.note});
    assert.notEqual(row.status,'resolved','Deferring research is not factual resolution');
  }
  for(const issue of plan.issueAdditions){const row=db.prepare('SELECT status,note FROM review_issues WHERE record_id=? AND field=?').get(issue.recordId,issue.field);assert.deepEqual({...row},{status:issue.status,note:issue.note});}
  const supplements=readdirSync(join(root,'data/reviews')).filter(n=>/^supplement-\d+\.json$/.test(n)).sort().map(n=>JSON.parse(readFileSync(join(root,'data/reviews',n),'utf8')));
  const boundary=supplements.findIndex(b=>b.id===plan.afterSupplementId);assert.ok(boundary>=0);
  for(const update of plan.limitationUpdates){
    const later=supplements.slice(boundary+1).flatMap(b=>b.records).findLast(r=>r.id===update.recordId);
    const actual=JSON.parse(db.prepare('SELECT limitations FROM record_reviews WHERE record_id=?').get(update.recordId).limitations);
    assert.deepEqual(actual,later?.limitations??update.limitations,'Later factual reviews supersede the historical plan limitations');
    assert.ok(actual.includes(update.limitations.find(n=>n.startsWith('Current release-date research'))),'Later supplements must retain the US-only research policy');
  }
  assert.equal(db.prepare("SELECT value FROM facts WHERE record_id='films:3' AND key='release_date'").get().value,'1983-05-25','Do not replace the sourced US premiere with conflicting generic title-page metadata');
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM review_issues WHERE record_id='films:3' AND field='complete_episode_and_master_inventory'").get().n,0);
  return {entries:inventory.works.length,included:included.length,missingCore:inventory.works.filter(w=>w.group==='core'&&w.archiveStatus==='missing').length};
}
