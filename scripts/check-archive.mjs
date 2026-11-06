import { checkProfileReviews } from './check-profile-reviews.mjs';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {editionInputFiles} from './apply-editions.mjs';
import {checkProductionInventory} from './check-production-inventory.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const db=new DatabaseSync(join(root,'data/archive.sqlite'),{readOnly:true});
const manifest=JSON.parse(readFileSync(join(root,'data/legacy/manifest.json'),'utf8'));
assert.equal(db.prepare('PRAGMA integrity_check').get().integrity_check,'ok');
assert.equal(db.prepare('PRAGMA foreign_key_check').all().length,0);
for(const collection of manifest.collections){
  const actual=db.prepare("SELECT COUNT(*) AS count FROM records WHERE category=? AND review_status='legacy'").get(collection.category).count;
  assert.equal(actual,collection.count,`${collection.category}: all original records must survive the import`);
  const raws=JSON.parse(readFileSync(join(root,`data/legacy/${collection.category}.json`),'utf8'));
  for(const raw of raws){
    assert.equal(Object.hasOwn(raw,'opening_crawl'),false,'Narrative crawls must not be imported');
    const id=raw.url.match(/\/(\d+)\/?$/)[1];
    const row=db.prepare('SELECT title FROM records WHERE category=? AND legacy_id=?').get(collection.category,id);
    assert.equal(row?.title,raw.title??raw.name,'Legacy numeric addresses must resolve to the original record');
  }
}
const editorial=JSON.parse(readFileSync(join(root,'data/editorial.json'),'utf8'));
const batches=readdirSync(join(root,'data/reviews')).filter(name=>/^pilot-\d+\.json$/.test(name)).sort().map(name=>JSON.parse(readFileSync(join(root,'data/reviews',name),'utf8')));
const supplement=JSON.parse(readFileSync(join(root,'data/reviews/supplement-06.json'),'utf8'));
const supplements=readdirSync(join(root,'data/reviews')).filter(name=>/^supplement-\d+\.json$/.test(name)).sort().map(name=>JSON.parse(readFileSync(join(root,'data/reviews',name),'utf8')));
const supplementaryEntries=supplements.flatMap(b=>b.records);
const reviewPlan=JSON.parse(readFileSync(join(root,'data/reviews/review-plan-01.json'),'utf8'));
const plannedLimitations=new Map(reviewPlan.limitationUpdates.map(r=>[r.recordId,r.limitations]));
const planBoundary=supplements.findIndex(b=>b.id===reviewPlan.afterSupplementId);
assert.ok(planBoundary>=0,'Research plan needs an existing supplement boundary');
for(const batch of supplements.slice(planBoundary+1))for(const r of batch.records)plannedLimitations.set(r.id,r.limitations);
const supplementalRecords=new Map(supplementaryEntries.map(r=>[r.id,r]));
const expectedFact=(id,key,fallback)=>supplementaryEntries.filter(r=>r.id===id).flatMap(r=>r.facts).findLast(f=>f.key===key)??fallback;
const reviewed=batches.flatMap(b=>b.records);
const overlays=new Map(reviewed.map(r=>[r.id,r]));
const supporting=[...reviewed,...supplementaryEntries].filter(r=>r.newRecord);
assert.equal(db.prepare("SELECT COUNT(*) AS count FROM records WHERE review_status='editorial'").get().count,editorial.length+supporting.length,'Rebuild the database after changing editorial input');
for(const entry of editorial){
  const id=`${entry.category}:${entry.id}`;
  const row=db.prepare('SELECT title,year,era,continuity,summary FROM records WHERE id=?').get(id);
  assert.deepEqual({...row},{title:entry.title,year:entry.year,era:entry.era,continuity:entry.continuity,summary:overlays.get(id)?.summary.text??entry.summary},'Editorial records must match the local input');
  assert.equal(db.prepare('SELECT url FROM sources WHERE id=?').get(`official-${entry.id}`)?.url,entry.source);
  for(const [key,value] of Object.entries(entry.facts))assert.equal(db.prepare('SELECT value FROM facts WHERE record_id=? AND key=?').get(id,key)?.value,String(expectedFact(id,key,overlays.get(id)?.facts.find(f=>f.key===key))?.value??value),'Editorial facts must match the local input');
}
assert.equal(db.prepare('SELECT COUNT(*) AS count FROM records r WHERE NOT EXISTS(SELECT 1 FROM record_sources s WHERE s.record_id=r.id)').get().count,0,'Every record needs provenance');
assert.equal(db.prepare('SELECT COUNT(*) AS count FROM facts f WHERE NOT EXISTS(SELECT 1 FROM record_sources s WHERE s.record_id=f.record_id AND s.source_id=f.source_id)').get().count,0,'Fact citations must be listed on the corresponding record');
assert.equal(db.prepare("SELECT COUNT(*) AS count FROM facts WHERE value LIKE '%/api/%' OR key='opening_crawl'").get().count,0,'Facts must not contain remote relationship identifiers or crawls');
assert.equal(db.prepare("SELECT COUNT(*) AS count FROM records WHERE title='' OR slug='' OR slug LIKE '%/%'").get().count,0,'Records need valid local addresses');
assert.equal(db.prepare("SELECT COUNT(*) AS count FROM links WHERE record_id='people:4' AND target_id='people:11' AND relation='identity' AND review_status='reference'").get().count,1,'Anakin and Vader must have an explicit sourced identity connection');
for(const source of db.prepare('SELECT url FROM sources').all())assert.equal(new URL(source.url).protocol,'https:');

// The review overlay must survive an offline rebuild with all evidence and scope intact.
for(const batch of batches){
  assert.equal(db.prepare('SELECT checked_at FROM review_batches WHERE id=?').get(batch.id)?.checked_at,batch.checkedAt);
  for(const entry of batch.records){
    assert.equal(db.prepare('SELECT summary FROM records WHERE id=?').get(entry.id)?.summary,entry.summary.text);
    assert.equal(db.prepare('SELECT scope FROM record_reviews WHERE record_id=?').get(entry.id)?.scope,entry.review.scope);
    for(const f of entry.facts){
      const finalFact=expectedFact(entry.id,f.key,f);
      const actual=db.prepare('SELECT value,review_status FROM facts WHERE record_id=? AND key=?').get(entry.id,f.key);
      assert.deepEqual({...actual},{value:finalFact.value,review_status:'verified'});
      const evidence=db.prepare("SELECT source_id,locator FROM citations WHERE record_id=? AND subject_type='fact' AND subject_key=? ORDER BY id").all(entry.id,f.key);
      assert.deepEqual(evidence.map(e=>({...e})),finalFact.evidence.map(e=>({source_id:e.sourceId,locator:e.locator})));
    }
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM credits WHERE record_id=?').get(entry.id).n,entry.credits.length+supplementaryEntries.filter(r=>r.id===entry.id).reduce((n,r)=>n+r.credits.length,0));
    for(const l of entry.links)assert.equal(db.prepare('SELECT review_status FROM links WHERE record_id=? AND target_id=? AND relation=?').get(entry.id,l.targetId,l.relation)?.review_status,'verified');
  }
}
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM facts f WHERE review_status='verified' AND NOT EXISTS(SELECT 1 FROM citations c WHERE c.record_id=f.record_id AND c.subject_type='fact' AND c.subject_key=f.key)").get().n,0);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM credits k WHERE NOT EXISTS(SELECT 1 FROM citations c WHERE c.record_id=k.record_id AND c.subject_type='credit' AND c.subject_key=k.id)").get().n,0);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM citations c WHERE NOT EXISTS(SELECT 1 FROM record_sources r WHERE r.record_id=c.record_id AND r.source_id=c.source_id) OR locator=''").get().n,0);
for(const c of db.prepare('SELECT * FROM citations').all()){
  if(c.subject_type==='summary')assert.ok(db.prepare("SELECT 1 FROM records WHERE id=? AND summary<>''").get(c.record_id));
  if(c.subject_type==='fact')assert.ok(db.prepare('SELECT 1 FROM facts WHERE record_id=? AND key=?').get(c.record_id,c.subject_key));
  if(c.subject_type==='credit')assert.ok(db.prepare('SELECT 1 FROM credits WHERE record_id=? AND id=?').get(c.record_id,c.subject_key));
  if(c.subject_type==='link'){
    const [from,to,relation]=c.subject_key.split('|');
    assert.equal(from,c.record_id);
    assert.ok(db.prepare("SELECT 1 FROM links WHERE record_id=? AND target_id=? AND relation=? AND review_status='verified'").get(from,to,relation));
  }
}
// Regression cases that the original upstream data did not distinguish.
assert.equal(db.prepare("SELECT value FROM facts WHERE record_id='films:2' AND key='release_date'").get().value,'1980-05-21');
assert.equal(db.prepare("SELECT value FROM facts WHERE record_id='films:1' AND key='producer'").get().value,'Gary Kurtz');
assert.equal(db.prepare("SELECT value FROM facts WHERE record_id='films:2' AND key='story'").get().value,'George Lucas');
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM credits WHERE record_id='films:2' AND role='Screenwriter'").get().n,2);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM credits WHERE record_id='series:andor' AND role='Composer' AND scope<>''").get().n,2);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM credits WHERE record_id IN ('films:1','films:2') AND role='Voice performer' AND character_name='Darth Vader'").get().n,2);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM credits c JOIN records r ON r.id=c.character_record_id WHERE r.category<>'people'").get().n,0);
const snapshot=JSON.parse(readFileSync(join(root,'data/reviews/wikidata-2026-10-26.json'),'utf8'));
assert.equal(snapshot.license,'CC0-1.0');
for(const e of snapshot.entities){
  const source=db.prepare('SELECT revision,license,url FROM sources WHERE id=?').get('pilot-wd-'+e.id);
  assert.equal(source.revision,String(e.lastrevid));
  assert.equal(source.license,'CC0-1.0');
  assert.ok(source.url.includes('oldid='+e.lastrevid));
}


// A new edition is a version of the same work, with scoped release events and credits.
const editionInputs=editionInputFiles.map(file=>JSON.parse(readFileSync(join(root,'data/reviews',file),'utf8')));
const editionInput={editions:editionInputs.flatMap(input=>input.editions)};
assert.equal(db.prepare('SELECT COUNT(*) AS n FROM film_editions').get().n,editionInput.editions.length);
assert.equal(db.prepare('SELECT COUNT(*) AS n FROM records WHERE category=\'films\'').get().n,13,'Editions must not create duplicate film works');
for(const edition of editionInput.editions){
  const row=db.prepare('SELECT record_id,label,year,kind FROM film_editions WHERE id=?').get(edition.id);
  assert.deepEqual({...row},{record_id:edition.recordId,label:edition.label,year:edition.year,kind:edition.kind});
  for(const event of edition.releases){
    const actual=db.prepare('SELECT edition_id,date,territory,medium,event_type,status,note FROM release_events WHERE id=?').get(event.id);
    assert.deepEqual({...actual},{edition_id:edition.id,date:event.date,territory:event.territory,medium:event.medium,event_type:event.eventType,status:event.status,note:event.note});
  }
  for(const [position,credit] of edition.credits.entries()){
    const actual=db.prepare('SELECT p.name,c.role FROM edition_credits c JOIN contributors p ON p.id=c.contributor_id WHERE c.id=?').get(`${edition.id}:${position}`);
    assert.deepEqual({...actual},{name:credit.person,role:credit.role});
  }
}
for(const row of db.prepare('SELECT id,record_id FROM film_editions').all())assert.ok(db.prepare("SELECT 1 FROM citations WHERE record_id=? AND subject_type='edition' AND subject_key=?").get(row.record_id,row.id));
for(const row of db.prepare('SELECT id,record_id FROM release_events').all())assert.ok(db.prepare("SELECT 1 FROM citations WHERE record_id=? AND subject_type='release' AND subject_key=?").get(row.record_id,row.id));
for(const row of db.prepare('SELECT c.id,e.record_id FROM edition_credits c JOIN film_editions e ON e.id=c.edition_id').all())assert.ok(db.prepare("SELECT 1 FROM citations WHERE record_id=? AND subject_type='edition_credit' AND subject_key=?").get(row.record_id,row.id));
for(const c of db.prepare("SELECT * FROM citations WHERE subject_type IN ('edition','release','edition_credit')").all()){
  const query={edition:'SELECT 1 FROM film_editions WHERE id=? AND record_id=?',release:'SELECT 1 FROM release_events WHERE id=? AND record_id=?',edition_credit:'SELECT 1 FROM edition_credits x JOIN film_editions e ON e.id=x.edition_id WHERE x.id=? AND e.record_id=?'}[c.subject_type];
  assert.ok(db.prepare(query).get(c.subject_key,c.record_id),'Edition evidence must belong to its actual film');
}
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM credits c JOIN film_editions e ON e.id=c.edition_id WHERE c.record_id<>e.record_id OR e.kind<>'original'").get().n,0,'Original pilot credits must not leak into Special Edition work');
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM credits WHERE record_id IN ('films:1','films:2') AND edition_id IS NULL").get().n,0);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM release_events x JOIN film_editions e ON e.id=x.edition_id WHERE e.kind='revision' AND x.status='released'").get().n,editionInputs.flatMap(i=>i.editions).filter(e=>e.kind==='revision').reduce((n,e)=>n+e.releases.filter(r=>r.status==='released').length,0));
assert.equal(db.prepare("SELECT date FROM release_events WHERE edition_id='films:3:special-edition-1997' AND status='released'").get().date,'1997-03-14');
assert.equal(db.prepare("SELECT status FROM release_events WHERE id='films:3:special-edition-1997:announced-us-opening'").get().status,'superseded');
assert.equal(db.prepare("SELECT value FROM facts WHERE record_id='films:3' AND key='producer'").get().value,'Howard Kazanjian');
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM edition_credits c JOIN contributors p ON p.id=c.contributor_id JOIN film_editions e ON e.id=c.edition_id WHERE p.name='Rick McCallum' AND e.kind='revision'").get().n,3);


const filmBatch=JSON.parse(readFileSync(join(root,'data/reviews/pilot-02.json'),'utf8'));
assert.equal(filmBatch.records.filter(r=>r.primary).length,5);
for(const event of editionInputs.flatMap(i=>i.releases??[])){
  const row=db.prepare('SELECT record_id,edition_id,date,date_end,territory,medium,event_type,status,label,note FROM release_events WHERE id=?').get(event.id);
  assert.deepEqual({...row},{record_id:event.recordId,edition_id:null,date:event.date,date_end:event.dateEnd??null,territory:event.territory,medium:event.medium,event_type:event.eventType,status:event.status,label:event.label,note:event.note});
}
assert.equal(db.prepare('SELECT COUNT(*) AS n FROM release_events').get().n,editionInputs.reduce((n,input)=>n+input.editions.reduce((n,e)=>n+e.releases.length,0)+(input.releases??[]).length,0));
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM release_events WHERE edition_id IS NULL").get().n,editionInputs.flatMap(i=>i.releases??[]).filter(r=>!r.editionId).length,'Availability without an identified master must not be attached to an original print');
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM release_events WHERE medium NOT IN ('Theatrical','Television','Streaming')").get().n,0);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM release_events WHERE date='2002-05-07'").get().n,0,'BBFC classification is not a cinema release');
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM release_events WHERE edition_id='films:5:uk-pg-2002'").get().n,0,'Do not invent an exact cut-specific opening');
assert.equal(db.prepare("SELECT status FROM release_events WHERE id='films:5:3d-wide-postponed'").get().status,'superseded');
assert.equal(db.prepare("SELECT status FROM release_events WHERE id='films:6:3d-wide-postponed'").get().status,'superseded');
for(const [id,start,end] of [['films:5:3d-event','2013-07-26','2013-07-28'],['films:6:3d-event','2015-04-16','2015-04-19']]){
  const row=db.prepare('SELECT date,date_end FROM release_events WHERE id=?').get(id);
  assert.equal(row.date,start);assert.equal(row.date_end,end,'Convention window must retain its precision');
}
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM release_events x LEFT JOIN film_editions e ON e.id=x.edition_id JOIN records r ON r.id=x.record_id WHERE x.status='released' AND ((r.category='films' AND (e.kind='revision' OR x.edition_id IS NULL)) OR (r.category='series' AND NOT (x.date=COALESCE((SELECT value FROM facts WHERE record_id=r.id AND key='release_date'),'') AND x.event_type IN ('series_premiere','television_premiere','platform_launch'))))").get().n,editionInputs.flatMap(i=>[...i.editions.flatMap(e=>e.releases.map(r=>({...r,recordId:e.recordId,editionKind:e.kind}))),...(i.releases??[]).map(r=>({...r,editionKind:null}))]).filter(r=>r.status==='released'&&(r.recordId.startsWith('series:')?!(r.date===db.prepare("SELECT value FROM facts WHERE record_id=? AND key='release_date'").get(r.recordId)?.value&&['series_premiere','television_premiere','platform_launch'].includes(r.eventType)):r.editionKind==='revision'||r.editionKind===null)).length,'Only released additional events enter the timeline');
for(const c of db.prepare('SELECT c.record_id,e.record_id AS owner,e.kind FROM credits c JOIN film_editions e ON e.id=c.edition_id').all()){
  assert.equal(c.record_id,c.owner);assert.equal(c.kind,'original');
}
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM credits WHERE record_id IN ('films:4','films:5','films:6','films:clone-wars-film','films:force-awakens') AND edition_id IS NULL").get().n,0);
const performer=(record,character)=>db.prepare('SELECT p.name FROM credits c JOIN contributors p ON p.id=c.contributor_id WHERE c.record_id=? AND c.character_name=?').get(record,character)?.name;
assert.equal(performer('films:4','Anakin Skywalker'),'Jake Lloyd');
assert.equal(performer('films:5','Anakin Skywalker'),'Hayden Christensen');
assert.equal(performer('films:clone-wars-film','Anakin Skywalker'),'Matt Lanter');
assert.equal(performer('films:clone-wars-film','Count Dooku'),'Christopher Lee');
assert.equal(performer('films:clone-wars-film','Mace Windu'),'Samuel L. Jackson');
assert.equal(db.prepare("SELECT value FROM facts WHERE record_id='films:clone-wars-film' AND key='composer'").get().value,'Kevin Kiner');
assert.equal(db.prepare("SELECT value FROM facts WHERE record_id='films:clone-wars-film' AND key='original_music'").get().value,'John Williams');
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM credits WHERE record_id='films:force-awakens' AND role='Screenwriter'").get().n,3);
for(const c of db.prepare("SELECT source_id,locator FROM citations WHERE record_id='films:force-awakens' AND subject_type='credit' AND subject_key IN (SELECT id FROM credits WHERE record_id='films:force-awakens' AND role='Screenwriter')").all())assert.equal(c.source_id,'film02-lucasfilm-force','Use final writing credits, not an earlier announcement');

// Batch 03: presentation variants, final writing roles and film/series identity.
const third=JSON.parse(readFileSync(join(root,'data/reviews/pilot-03.json'),'utf8'));
assert.equal(third.records.filter(r=>r.primary).length,5);
for(const f of third.records.filter(r=>r.primary))assert.equal(db.prepare('SELECT COUNT(*) AS n FROM credits WHERE record_id=? AND edition_id IS NULL').get(f.id).n,0,'Original film credits need their own original edition');
assert.equal(performer('films:last-jedi','Kylo Ren'),'Adam Driver');
assert.equal(performer('films:solo','Han Solo'),'Alden Ehrenreich');
assert.equal(performer('films:mandalorian-grogu','Rotta the Hutt'),'Jeremy Allen White');
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM credits WHERE record_id='films:rise-skywalker' AND role='Screenwriter'").get().n,2);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM credits WHERE record_id='films:rise-skywalker' AND role='Story'").get().n,4);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM credits c JOIN contributors p ON p.id=c.contributor_id WHERE c.record_id='films:mandalorian-grogu' AND c.role='Screenwriter' AND p.name='Noah Kloor'").get().n,1);
assert.equal(db.prepare("SELECT value FROM facts WHERE record_id='films:solo' AND key='composer'").get().value,'John Powell');
assert.equal(db.prepare("SELECT value FROM facts WHERE record_id='films:solo' AND key='release_date'").get().value,'2018-05-25');
assert.equal(db.prepare("SELECT value FROM facts WHERE record_id='films:rise-skywalker' AND key='release_date'").get().value,'2019-12-20');
assert.equal(db.prepare("SELECT edition_id FROM release_events WHERE id='films:rogue-one:imax-return-2022'").get().edition_id,null,'IMAX event is not proof of an extended story cut');
assert.equal(db.prepare("SELECT date FROM release_events WHERE id='films:rise-skywalker:disney-nl-2020'").get().date,'2020-05-05');
assert.equal(db.prepare("SELECT date FROM release_events WHERE id='films:mandalorian-grogu:imax-disney-2026'").get().date,'2026-09-02');
assert.equal(db.prepare("SELECT medium FROM release_events WHERE id='films:last-jedi:score-only-disney-2019'").get().medium,'Streaming');
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM edition_credits WHERE edition_id IN ('films:last-jedi:score-only-2018','films:mandalorian-grogu:imax-enhanced-2026')").get().n,0,'Do not invent presentation-specific crew');
assert.ok(db.prepare("SELECT summary FROM records WHERE id='starships:razor-crest-2026'").get().summary.includes('replacing'));

// Batch 04: series release ownership, superseded streaming dates, and TV-specific roles.
const fourth=JSON.parse(readFileSync(join(root,'data/reviews/pilot-04.json'),'utf8'));
assert.equal(fourth.records.filter(r=>r.primary).length,5);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM record_reviews WHERE is_primary=1").get().n,batches.reduce((n,b)=>n+b.records.filter(r=>r.primary).length,0));
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM credits WHERE record_id='films:3' AND edition_id='films:3:theatrical-1983'").get().n,25);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM credits WHERE record_id LIKE 'series:%' AND edition_id IS NOT NULL").get().n,0,'General series credits must not become pilot revision credits');
assert.equal(db.prepare("SELECT status FROM release_events WHERE id='series:rebels:spark-watch-announced'").get().status,'superseded');
assert.equal(db.prepare("SELECT date FROM release_events WHERE id='series:rebels:spark-watch-actual'").get().date,'2014-09-26');
assert.equal(db.prepare("SELECT medium FROM release_events WHERE id='series:rebels:spark-abc'").get().medium,'Television');
assert.equal(db.prepare("SELECT date FROM release_events WHERE id='series:clone-wars-micro:disney-2021'").get().date,'2021-04-02');
assert.equal(db.prepare("SELECT value FROM facts WHERE record_id='series:clone-wars-micro' AND key='episodes'").get().value,'25 original chapters');
assert.equal(performer('series:clone-wars-micro','Mace Windu'),'Terrence “T.C.” Carson');
assert.equal(performer('series:bad-batch','Omega'),'Michelle Ang');
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM credits c JOIN contributors p ON p.id=c.contributor_id WHERE c.record_id='series:mandalorian' AND c.role='Composer' AND p.name='Joseph Shirley' AND c.scope='Season 3'").get().n,1);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM release_events r JOIN records p ON p.id=r.record_id WHERE p.category NOT IN ('films','series')").get().n,0);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM film_editions e JOIN records r ON r.id=e.record_id WHERE r.category NOT IN ('films','series')").get().n,0);

// Batch 05: actual launch times, episode writing roles and announced seasons.
const fifth=JSON.parse(readFileSync(join(root,'data/reviews/pilot-05.json'),'utf8'));
assert.equal(fifth.records.filter(r=>r.primary).length,5);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM records r WHERE r.category IN ('films','series') AND NOT EXISTS(SELECT 1 FROM record_reviews v WHERE v.record_id=r.id AND v.is_primary=1)").get().n,0,'Every currently catalogued work has received its scoped production review');
assert.equal(db.prepare("SELECT value FROM facts WHERE record_id='series:obi-wan' AND key='release_date'").get().value,'2022-05-26');
assert.ok(db.prepare("SELECT value FROM facts WHERE record_id='series:obi-wan' AND key='release_scope'").get().value.includes('midnight Eastern on May 27'));
assert.equal(db.prepare("SELECT date FROM release_events WHERE id='series:ahsoka:disney-premiere-2023'").get().date,'2023-08-22');
assert.equal(db.prepare("SELECT status FROM release_events WHERE id='series:ahsoka:announced-premiere-2023'").get().status,'superseded');
assert.equal(db.prepare("SELECT status FROM release_events WHERE id='series:skeleton-crew:announced-premiere-2024'").get().status,'superseded');
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM release_events WHERE record_id='series:skeleton-crew' AND date='2024-12-02' AND status='released'").get().n,2,'Simultaneous cinema and streaming events are distinct');
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM release_events WHERE date>'2026-10-27' AND status='released'").get().n,0,'Announced future seasons must not become released events');
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM film_editions WHERE record_id IN ('series:obi-wan','series:ahsoka','series:skeleton-crew','series:acolyte','series:maul-shadow-lord')").get().n,0,'Cinema episode screenings do not establish new cuts');
assert.equal(performer('series:ahsoka','Baylan Skoll'),'Ray Stevenson');
assert.equal(performer('series:ahsoka','Huyang'),'David Tennant');
assert.equal(performer('series:acolyte','Mae Aniseya'),'Amandla Stenberg');
assert.equal(performer('series:acolyte','Osha Aniseya'),'Amandla Stenberg');
assert.equal(db.prepare("SELECT COUNT(DISTINCT character_record_id) AS n FROM credits c JOIN contributors p ON p.id=c.contributor_id WHERE c.record_id='series:acolyte' AND p.name='Amandla Stenberg'").get().n,2,'Twin roles must remain separate character identities');
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM credits WHERE record_id='series:acolyte' AND role='Writer'").get().n,15);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM credits WHERE record_id='series:acolyte' AND role='Writer' AND scope='Season 1, episode 7'").get().n,3);
assert.equal(db.prepare("SELECT value FROM facts WHERE record_id='series:skeleton-crew' AND key='composer'").get().value,'Mick Giacchino');
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM credits WHERE record_id='series:maul-shadow-lord' AND role='Composer'").get().n,3);
assert.equal(performer('series:maul-shadow-lord','Dryden Vos'),'Scott Whyte');
assert.equal(performer('series:maul-shadow-lord','Maul'),'Sam Witwer');
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM sources s WHERE s.id LIKE 'screen05-%' AND NOT EXISTS(SELECT 1 FROM citations c WHERE c.source_id=s.id)").get().n,0,'Every newly registered source has a cited subject');


// Supplement 06 is additive: primary-work reviews and release identities stay intact.
assert.equal(supplement.records.length,5);
assert.equal(db.prepare('SELECT COUNT(*) AS n FROM review_supplements').get().n,supplementaryEntries.length);
assert.equal(db.prepare('SELECT COUNT(*) AS n FROM record_reviews WHERE is_primary=1').get().n,24);
assert.equal(db.prepare('SELECT COUNT(*) AS n FROM episodes').get().n,151);
assert.equal(db.prepare('SELECT SUM(number_end-number_start+1) AS n FROM episodes').get().n,160);
assert.equal(db.prepare('SELECT COUNT(*) AS n FROM episode_credits').get().n,65);
assert.ok(db.prepare('SELECT COUNT(*) AS n FROM episode_links').get().n>=19,'Previously verified episode connections must survive supplements');
for(const r of supplement.records){
  const actualEpisodes=db.prepare('SELECT * FROM episodes WHERE record_id=? ORDER BY season,number_start').all(r.id);
  assert.equal(actualEpisodes.length,r.episodes.length);
  const seen=new Set();
  for(const e of r.episodes){
    const actual=db.prepare('SELECT season,number_start,number_end,title,source_label,note FROM episodes WHERE id=? AND record_id=?').get(e.id,r.id);
    assert.deepEqual({...actual},{season:e.season,number_start:e.start,number_end:e.end,title:e.title,source_label:e.sourceLabel,note:e.note});
    for(let part=e.start;part<=e.end;part++){const key=`${e.season}:${part}`;assert.equal(seen.has(key),false,'A numbered part must not be counted twice');seen.add(key);}
    for(const [i,c] of e.credits.entries()){
      const actual=db.prepare('SELECT p.name,c.role,c.credit_line FROM episode_credits c JOIN contributors p ON p.id=c.contributor_id WHERE c.id=? AND c.episode_id=?').get(`${e.id}:credit:${i}`,e.id);
      assert.deepEqual({...actual},{name:c.person,role:c.role,credit_line:c.creditLine});
    }
  }
  for(const season of new Set(r.episodes.map(e=>e.season))){
    const parts=r.episodes.filter(e=>e.season===season).flatMap(e=>Array.from({length:e.end-e.start+1},(_,i)=>e.start+i));
    assert.deepEqual(parts,Array.from({length:parts.length},(_,i)=>i+1),'Season numbering must be contiguous');
  }
  for(const resolution of r.resolutions)assert.equal(db.prepare("SELECT COUNT(*) AS n FROM review_issues WHERE record_id=? AND field=? AND status='pending'").get(r.id,resolution.field).n,0);
  assert.deepEqual(JSON.parse(db.prepare('SELECT limitations FROM record_reviews WHERE record_id=?').get(r.id).limitations),plannedLimitations.get(r.id)??supplementalRecords.get(r.id).limitations);
  for(const c of r.creditUpdates){
    const row=db.prepare('SELECT scope,note FROM credits WHERE id=?').get(c.id);
    assert.deepEqual({...row},{scope:c.scope,note:c.note});
  }
}
for(const [type,table] of [['episode','episodes'],['episode_credit','episode_credits'],['episode_link','episode_links']]){
  for(const c of db.prepare('SELECT record_id,subject_key FROM citations WHERE subject_type=?').all(type)){
    const query=type==='episode'?`SELECT 1 FROM ${table} WHERE id=? AND record_id=?`:`SELECT 1 FROM ${table} c JOIN episodes e ON e.id=c.episode_id WHERE c.id=? AND e.record_id=?`;
    assert.ok(db.prepare(query).get(c.subject_key,c.record_id),'Episode evidence must belong to this series');
  }
  const query=type==='episode'?`SELECT id,record_id FROM ${table}`:`SELECT c.id,e.record_id FROM ${table} c JOIN episodes e ON e.id=c.episode_id`;
  for(const row of db.prepare(query).all())assert.ok(db.prepare('SELECT 1 FROM citations WHERE record_id=? AND subject_type=? AND subject_key=?').get(row.record_id,type,row.id),'Every episode subject needs its own citation');
}
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM sources s WHERE s.id LIKE 'supp06-%' AND NOT EXISTS(SELECT 1 FROM citations c WHERE c.source_id=s.id)").get().n,0);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_links WHERE episode_id='series:rebels:s2e14' AND target_id='starships:ghost' AND relation='featured_ship'").get().n,1);
const episodeNames=(id,role)=>db.prepare('SELECT p.name FROM episode_credits c JOIN contributors p ON p.id=c.contributor_id WHERE c.episode_id=? AND c.role=? ORDER BY c.position').all(id,role).map(r=>r.name);
assert.deepEqual(episodeNames('series:obi-wan:s1e6','Story by'),['Stuart Beattie','Joby Harold','Andrew Stanton']);
assert.deepEqual(episodeNames('series:obi-wan:s1e6','Teleplay by'),['Joby Harold','Andrew Stanton','Hossein Amini']);
assert.deepEqual(episodeNames('series:skeleton-crew:s1e5','Written by'),['Myung Joh Wesner']);
assert.deepEqual(episodeNames('series:skeleton-crew:s1e6','Written by'),['Myung Joh Wesner']);
assert.deepEqual(episodeNames('series:mandalorian:s1e6','Story by'),['Christopher L. Yost']);
assert.deepEqual(episodeNames('series:mandalorian:s3e3','Written by'),['Noah Kloor','Jon Favreau']);
assert.equal(db.prepare("SELECT number_start FROM episodes WHERE record_id='series:rebels' AND title='Rebel Assault'").get().number_start,9);
assert.equal(db.prepare("SELECT number_end FROM episodes WHERE record_id='series:rebels' AND season=4 AND number_start=15").get().number_end,16);
assert.equal(db.prepare("SELECT number_end-number_start+1 AS n FROM episodes WHERE record_id='series:bad-batch' AND title='Aftermath'").get().n,1);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episodes WHERE record_id='series:rebels' AND title LIKE '%ABC%'").get().n,0,'ABC pilot revision is not an additional story episode');
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_links WHERE episode_id='series:obi-wan:s1e1' AND target_id='planets:2' AND relation='setting'").get().n,1);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_links WHERE episode_id='series:bad-batch:s3e9' AND target_id='people:asajj-ventress'").get().n,1);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_links WHERE episode_id='series:bad-batch:s1e1' AND target_id='people:asajj-ventress'").get().n,0,'Series-wide connections must not be propagated into every episode');


// Supplement 07: explicit reviewed cohorts, no mention-to-appearance or album-to-TV inference.
const supplement07=supplements.find(b=>b.id==='SUPPLEMENT-07');
assert.ok(supplement07);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_reviews WHERE batch_id='SUPPLEMENT-07'").get().n,14);
assert.equal(db.prepare('SELECT COUNT(*) AS n FROM episode_reviews').get().n,supplementaryEntries.reduce((n,r)=>n+(r.episodeReviews?.length??0),0));
for(const r of supplements.filter(b=>b.id!=='SUPPLEMENT-06').flatMap(b=>b.records)){
  for(const f of r.facts){const row=db.prepare('SELECT value,review_status FROM facts WHERE record_id=? AND key=?').get(r.id,f.key);assert.deepEqual({...row},{value:f.value,review_status:'verified'});}
  if(r.newRecord){assert.equal(db.prepare('SELECT summary FROM records WHERE id=?').get(r.id).summary,r.summary.text);assert.equal(db.prepare('SELECT is_primary FROM record_reviews WHERE record_id=?').get(r.id).is_primary,0);}
  for(const c of r.credits){const row=db.prepare('SELECT c.id FROM credits c JOIN contributors p ON p.id=c.contributor_id WHERE c.record_id=? AND p.name=? AND c.role=? AND c.scope=?').get(r.id,c.person,c.role,c.scope);assert.ok(row);assert.ok(db.prepare("SELECT 1 FROM citations WHERE subject_type='credit' AND subject_key=?").get(row.id));}
  for(const review of r.episodeReviews??[]){
    const row=db.prepare('SELECT v.* FROM episode_reviews v JOIN episodes e ON e.id=v.episode_id WHERE v.episode_id=? AND e.record_id=?').get(review.episodeId,r.id);assert.ok(row);
    assert.deepEqual(JSON.parse(row.considered_targets),review.consideredTargets);assert.deepEqual(JSON.parse(row.notes),review.notes);assert.equal(row.scope,review.scope);
    assert.ok(db.prepare("SELECT 1 FROM citations WHERE record_id=? AND subject_type='episode_review' AND subject_key=?").get(r.id,review.episodeId));
    for(const l of review.links){const actual=db.prepare('SELECT id,note,representation FROM episode_links WHERE episode_id=? AND target_id=? AND relation=?').get(review.episodeId,l.targetId,l.relation);assert.ok(actual);assert.equal(actual.representation,l.representation);assert.equal(actual.note,l.note);assert.ok(review.consideredTargets.includes(l.targetId));const cites=db.prepare("SELECT source_id,locator FROM citations WHERE subject_type='episode_link' AND subject_key=? ORDER BY id").all(actual.id);assert.deepEqual(cites.map(c=>({...c})),l.evidence.map(c=>({source_id:c.sourceId,locator:c.locator})));}
  }
}
for(const c of db.prepare("SELECT record_id,subject_key FROM citations WHERE subject_type='episode_review'").all())assert.ok(db.prepare('SELECT 1 FROM episode_reviews v JOIN episodes e ON e.id=v.episode_id WHERE v.episode_id=? AND e.record_id=?').get(c.subject_key,c.record_id));
for(const source of supplements.flatMap(b=>b.sources))assert.ok(db.prepare('SELECT 1 FROM citations WHERE source_id=?').get(source.id),'Every registered source must be used');
const representation=(episode,target)=>db.prepare('SELECT representation FROM episode_links WHERE episode_id=? AND target_id=?').get(episode,target)?.representation;
assert.equal(representation('series:obi-wan:s1e5','people:11'),'flashback');
assert.equal(representation('series:obi-wan:s1e5','people:68'),'transmission');
assert.equal(representation('series:obi-wan:s1e6','people:21'),'transmission');
assert.equal(representation('series:obi-wan:s1e6','people:32'),'force_spirit');
for(const [episode,target] of [['series:obi-wan:s1e5','people:1'],['series:obi-wan:s1e5','planets:1'],['series:obi-wan:s1e3','people:32'],['series:skeleton-crew:s1e4','planets:at-attin'],['series:skeleton-crew:s1e6','planets:at-attin'],['series:skeleton-crew:s1e8','vehicles:fern-kb-hoverbike']])assert.equal(representation(episode,target),undefined,'A mention or unidentified vehicle is not a verified appearance');
assert.equal(db.prepare("SELECT value FROM facts WHERE record_id='planets:nur' AND key='classification'").get().value,'Moon');
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_credits c JOIN episodes e ON e.id=c.episode_id WHERE e.record_id='series:bad-batch'").get().n,0,'Album credits are not final episode credits');


// Supplement 08: first-season scenes stay separate from later-series and replacement-ship data.
const supplement08=supplements.find(b=>b.id==='SUPPLEMENT-08');assert.ok(supplement08);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_reviews WHERE batch_id='SUPPLEMENT-08'").get().n,8);
const mando08=supplement08.records.find(r=>r.id==='series:mandalorian');
assert.deepEqual(mando08.episodeReviews.map(e=>e.episodeId),Array.from({length:8},(_,i)=>`series:mandalorian:s1e${i+1}`));
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_links l JOIN episodes e ON e.id=l.episode_id WHERE e.record_id='series:mandalorian' AND e.season=1").get().n,61);
for(const review of mando08.episodeReviews){assert.equal(review.consideredTargets.length,26);assert.equal(new Set(review.consideredTargets).size,26);}
for(const update of mando08.creditUpdates){const row=db.prepare('SELECT character_record_id,scope,note FROM credits WHERE id=?').get(update.id);assert.equal(row.character_record_id,update.characterRecordId);assert.equal(row.scope,update.scope);assert.equal(row.note,update.note);}
assert.equal(representation('series:mandalorian:s1e2','planets:arvala-7'),'direct');
assert.equal(representation('series:mandalorian:s1e2','planets:1'),undefined,'Jawas and a sandcrawler do not imply Tatooine');
assert.equal(representation('series:mandalorian:s1e4','vehicles:at-st-raider'),'direct');
assert.equal(representation('series:mandalorian:s1e5','planets:1'),'direct');
assert.equal(representation('series:mandalorian:s1e6','starships:new-republic-prison-ship'),'direct');
assert.equal(representation('series:mandalorian:s1e7','people:moff-gideon'),'direct','An earlier comlink call must not hide a later in-person appearance');
assert.match(db.prepare("SELECT note FROM episode_links WHERE episode_id='series:mandalorian:s1e7' AND target_id='people:moff-gideon'").get().note,/comlink/);
assert.match(db.prepare("SELECT note FROM episode_links WHERE episode_id='series:mandalorian:s1e7' AND target_id='people:ig-11'").get().note,/rebuilding/);
assert.equal(representation('series:mandalorian:s1e8','starships:gideon-tie-fighter'),'direct');
for(const target of ['people:1','people:ahsoka-tano','starships:razor-crest-2026'])assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_links l JOIN episodes e ON e.id=l.episode_id WHERE e.record_id='series:mandalorian' AND e.season=1 AND l.target_id=?").get(target).n,0,'Later-series profiles must not be propagated into season one');
assert.equal(representation('series:mandalorian:s1e5','people:22'),undefined,'Mystery figure is not identified from a series cast list');
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM release_events").get().n,82,'Appearance review must not create release events');
assert.equal(db.prepare('SELECT COUNT(*) AS n FROM film_editions').get().n,26);


// Supplement 09: released second-season scenes, recorded reports and post-credit story.
const supplement09=supplements.find(b=>b.id==='SUPPLEMENT-09');assert.ok(supplement09);
const mando09=supplement09.records.find(r=>r.id==='series:mandalorian');
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_reviews WHERE batch_id='SUPPLEMENT-09'").get().n,8);
assert.deepEqual(mando09.episodeReviews.map(e=>e.episodeId),Array.from({length:8},(_,i)=>`series:mandalorian:s2e${i+1}`));
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_links l JOIN episodes e ON e.id=l.episode_id WHERE e.record_id='series:mandalorian' AND e.season=2").get().n,76);
for(const review of mando09.episodeReviews){assert.equal(review.consideredTargets.length,43);assert.equal(new Set(review.consideredTargets).size,43);}
assert.equal(representation('series:mandalorian:s2e3','people:moff-gideon'),'transmission');
assert.equal(representation('series:mandalorian:s2e4','people:dr-pershing'),'transmission');
assert.equal(representation('series:mandalorian:s2e5','people:ahsoka-tano'),'direct');
assert.equal(representation('series:mandalorian:s2e8','people:1'),'direct');
assert.equal(representation('series:mandalorian:s2e8','people:45'),'direct');
assert.match(db.prepare("SELECT note FROM episode_links WHERE episode_id='series:mandalorian:s2e8' AND target_id='planets:1'").get().note,/Post-credit/);
assert.equal(representation('series:mandalorian:s2e7','planets:morak'),'direct');
assert.match(db.prepare("SELECT note FROM episode_links WHERE episode_id='series:mandalorian:s2e7' AND target_id='planets:morak'").get().note,/Morac/);
assert.equal(db.prepare("SELECT value FROM facts WHERE record_id='planets:trask' AND key='classification'").get().value,'Moon of Kol Iben');
for(const [episode,target] of [['s2e3','people:ahsoka-tano'],['s2e3','planets:corvus'],['s2e5','people:grand-admiral-thrawn'],['s2e5','planets:9'],['s2e5','planets:tython'],['s2e6','people:dr-pershing'],['s2e7','people:grogu'],['s2e8','people:axe-woves']])assert.equal(representation('series:mandalorian:'+episode,target),undefined,'Mention, destination or earlier team membership must not become a physical scene');
assert.equal(representation('series:mandalorian:s2e6','starships:razor-crest-original'),'direct');
for(const episode of ['s2e7','s2e8'])assert.equal(representation('series:mandalorian:'+episode,'starships:razor-crest-original'),undefined,'A destroyed ship must not be propagated into later missions');
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_links l JOIN episodes e ON e.id=l.episode_id WHERE e.record_id='series:mandalorian' AND e.season=2 AND l.target_id='starships:razor-crest-2026'").get().n,0);
assert.equal(db.prepare("SELECT character_record_id FROM credits WHERE id='pilot-04:series:mandalorian:33'").get().character_record_id,'people:bo-katan-kryze');
for(const update of supplement09.sourceUpdates){const row=db.prepare('SELECT title,note FROM sources WHERE id=?').get(update.id);assert.equal(row.title,update.title);assert.equal(row.note,update.note);}
assert.ok(db.prepare("SELECT 1 FROM citations WHERE source_id='supp06-mando-ep13'").get(),'Earlier valid Chapter 13 evidence must be retained');

const summary={records:db.prepare('SELECT COUNT(*) AS count FROM records').get().count,facts:db.prepare('SELECT COUNT(*) AS count FROM facts').get().count,links:db.prepare('SELECT COUNT(*) AS count FROM links').get().count};
const catalogue=checkProductionInventory(root,db);
// Supplement 10: all season-three episodes reviewed without turning memories or mentions into present-day scenes.
const supplement10=supplements.find(b=>b.id==='SUPPLEMENT-10');assert.ok(supplement10);
const mando10=supplement10.records.find(r=>r.id==='series:mandalorian');
assert.equal(supplement10.records.filter(r=>r.newRecord).length,18);
assert.deepEqual(mando10.episodeReviews.map(r=>r.episodeId),Array.from({length:8},(_,i)=>`series:mandalorian:s3e${i+1}`));
assert.equal(mando10.episodeReviews.reduce((n,r)=>n+r.links.length,0),69);
for(const review of mando10.episodeReviews){assert.equal(review.consideredTargets.length,43);assert.equal(new Set(review.consideredTargets).size,43);}
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_reviews WHERE episode_id LIKE 'series:mandalorian:%'").get().n,24);
for(const target of ['people:kelleran-beq','planets:9','starships:grogu-escape-yacht','vehicles:kelleran-escape-speeder'])assert.equal(representation('series:mandalorian:s3e4',target),'flashback');
assert.equal(representation('series:mandalorian:s3e4','people:grogu'),'direct','The single Grogu row also includes present-day scenes');
assert.equal(representation('series:mandalorian:s3e3','planets:9'),'direct','Pershing lives on present-day Coruscant');
assert.equal(representation('series:mandalorian:s3e7','vehicles:ig-12'),'direct');
assert.equal(representation('series:mandalorian:s3e8','people:ig-11'),'direct');
for(const [ep,target] of [['s3e4','planets:8'],['s3e5','people:moff-gideon'],['s3e5','starships:new-republic-prison-ship'],['s3e5','starships:pershing-shuttle'],['s3e6','people:kuiil'],['s3e7','people:grand-admiral-thrawn'],['s3e7','people:ig-11'],['s3e8','people:1'],['s3e8','people:dr-pershing']])assert.equal(representation('series:mandalorian:'+ep,target),undefined,'Mentions, history, manual bodies and separate prison ships must not be conflated');
for(let n=1;n<=8;n++)for(const target of ['starships:razor-crest-original','starships:razor-crest-2026'])assert.equal(representation('series:mandalorian:s3e'+n,target),undefined,'Neither destroyed original nor later replacement ship is a season-three connection');
for(const c of mando10.credits){const row=db.prepare('SELECT c.character_name,c.character_record_id FROM credits c JOIN contributors p ON p.id=c.contributor_id WHERE c.record_id=? AND p.name=? AND c.scope=?').get(mando10.id,c.person,c.scope);assert.equal(row.character_record_id,c.characterRecordId);assert.equal(row.character_name,c.characterName);}
assert.ok(db.prepare("SELECT 1 FROM review_issues WHERE record_id='series:mandalorian' AND status='pending'").get(),'Selected season-three review is not a complete credits/appearance inventory');

// Supplement 11: original pilot and revised ABC opening remain different versions.
const supplement11=supplements.find(b=>b.id==='SUPPLEMENT-11');assert.ok(supplement11);
const rebels11=supplement11.records.find(r=>r.id==='series:rebels');
assert.deepEqual(rebels11.episodeReviews.map(r=>r.episodeId),[1,3,4,5,6].map(n=>`series:rebels:s1e${n}`));
assert.equal(supplement11.records.filter(r=>r.newRecord).length,22);
assert.equal(rebels11.episodeReviews.reduce((n,r)=>n+r.links.length,0),79);
for(const review of rebels11.episodeReviews){assert.equal(review.consideredTargets.length,46);assert.equal(new Set(review.consideredTargets).size,46);}
const pilot11=db.prepare("SELECT number_start,number_end FROM episodes WHERE id='series:rebels:s1e1'").get();
assert.deepEqual({...pilot11},{number_start:1,number_end:2},'The combined pilot remains one guide entry');
for(const [ep,target] of [['s1e1','people:10'],['s1e1','people:grand-inquisitor'],['s1e5','people:gall-trayvis'],['s1e5','people:64']])assert.equal(representation('series:rebels:'+ep,target),'transmission');
for(const [ep,target] of [['s1e3','people:agent-kallus'],['s1e5','people:grand-inquisitor'],['s1e6','people:grand-inquisitor']])assert.equal(representation('series:rebels:'+ep,target),'direct','An earlier remote call does not erase a later physical scene');
for(const [ep,target] of [['s1e1','people:4'],['s1e1','people:12'],['s1e1','planets:14'],['s1e3','planets:2'],['s1e4','people:agent-kallus'],['s1e4','starships:phantom-original'],['s1e4','vehicles:8'],['s1e5','people:20'],['s1e5','people:44'],['s1e6','planets:stygeon-prime']])assert.equal(representation('series:rebels:'+ep,target),undefined,'Added scenes, mentions, aliases and distinct craft are not original-episode connections');
assert.equal(representation('series:rebels:s1e4','starships:ezra-zeb-tie-fighter'),'direct');
assert.equal(representation('series:rebels:s1e5','starships:phantom-original'),'direct');
assert.equal(representation('series:rebels:s1e6','starships:phantom-original'),'direct');
assert.ok(rebels11.episodeReviews[0].evidence.some(e=>e.sourceId==='screen04-rebels-abc'));
assert.ok(rebels11.episodeReviews.find(r=>r.episodeId.endsWith('s1e5')).links.find(l=>l.targetId==='people:64').note.includes('remains'));
assert.ok(!supplement11.records.some(r=>/dev-morgan|dhara-leonis|phantom-ii/.test(r.id)),'Alias, mentioned sister and later replacement are not new episode profiles');
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_links WHERE episode_id LIKE 'series:mandalorian:%'").get().n,206,'Prior Mandalorian connections survive the Rebels review');

// Supplement 12: nightmares and remote Force communication are not physical visits.
const supplement12=supplements.find(b=>b.id==='SUPPLEMENT-12');assert.ok(supplement12);
const rebels12=supplement12.records.find(r=>r.id==='series:rebels');
assert.deepEqual(rebels12.episodeReviews.map(r=>r.episodeId),[7,8,9,10,11].map(n=>`series:rebels:s1e${n}`));
assert.equal(supplement12.records.filter(r=>r.newRecord).length,13);
assert.equal(rebels12.episodeReviews.reduce((n,r)=>n+r.links.length,0),68);
for(const review of rebels12.episodeReviews){assert.equal(review.consideredTargets.length,63);assert.equal(new Set(review.consideredTargets).size,63);}
for(const target of ['people:grand-inquisitor','people:zeb-orrelios','people:sabine-wren','people:chopper'])assert.equal(representation('series:rebels:s1e10',target),'vision');
assert.equal(representation('series:rebels:s1e10','people:20'),'force_communication');
for(const target of ['people:kanan-jarrus','people:hera-syndulla','starships:ghost'])assert.equal(representation('series:rebels:s1e10',target),'direct','One mixed-context row must retain its actual story scene');
assert.equal(representation('series:rebels:s1e8','people:21'),'transmission','A File Holo is not a physical parade appearance');
assert.equal(representation('series:rebels:s1e8','people:gall-trayvis'),'transmission');
assert.equal(representation('series:rebels:s1e9','people:grand-inquisitor'),'direct','The Fort Anaxes duel is physical, unlike the later nightmare');
for(const n of [7,9])assert.equal(representation(`series:rebels:s1e${n}`,'planets:fort-anaxes-asteroid'),'direct');
assert.equal(db.prepare("SELECT value FROM facts WHERE record_id='planets:fort-anaxes-asteroid' AND key='classification'").get().value,'Asteroid base in the Rebels era');
for(const target of ['starships:empire-day-parade-prototype','starships:inquisitor-tie-prototype'])assert.equal(representation('series:rebels:s1e8',target),'direct');
assert.equal(representation('series:rebels:s1e9','starships:inquisitor-tie-prototype'),'direct');
for(const [ep,target] of [['s1e7','people:ahsoka-tano'],['s1e7','planets:lothal'],['s1e8','people:4'],['s1e8','starships:13'],['s1e9','people:ahsoka-tano'],['s1e9','people:zeb-orrelios'],['s1e9','planets:lothal'],['s1e9','starships:empire-day-parade-prototype'],['s1e9','starships:22'],['s1e11','people:old-jho'],['s1e11','people:cikatro-vizago'],['s1e11','starships:10']])assert.equal(representation('series:rebels:'+ep,target),undefined,'Mentions, deleted material, related biographies and distinct hulls must not become episode appearances');
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_reviews WHERE batch_id IN ('SUPPLEMENT-11','SUPPLEMENT-12')").get().n,10);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_links WHERE episode_id IN (SELECT episode_id FROM episode_reviews WHERE batch_id IN ('SUPPLEMENT-11','SUPPLEMENT-12'))").get().n,147);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_links WHERE episode_id LIKE 'series:mandalorian:%'").get().n,206);
assert.ok(rebels12.episodeReviews.find(r=>r.episodeId.endsWith('s1e10')).notes.some(n=>n.includes('real attack')));
for(const batch of supplements)for(const r of batch.records)for(const l of r.links??[])for(const e of l.evidence)assert.ok(db.prepare('SELECT 1 FROM record_sources WHERE record_id=? AND source_id=?').get(l.targetId,e.sourceId),'Reverse dossier connections must expose the exact cited source, without changing the target profile’s review status');

// Supplement 13: finish the first-season guide cohort without broadening edition/date scope.
const supplement13=supplements.find(b=>b.id==='SUPPLEMENT-13');assert.ok(supplement13);
const rebels13=supplement13.records.find(r=>r.id==='series:rebels');
assert.deepEqual(rebels13.episodeReviews.map(r=>r.episodeId),[12,13,14,15].map(n=>`series:rebels:s1e${n}`));
assert.equal(supplement13.records.filter(r=>r.newRecord).length,10);
assert.deepEqual(rebels13.episodeReviews.map(r=>r.links.length),[12,20,19,19]);
for(const review of rebels13.episodeReviews){assert.equal(review.consideredTargets.length,81);assert.equal(new Set(review.consideredTargets).size,81);}
for(const [ep,target] of [['s1e13','people:alton-kastle'],['s1e13','people:gall-trayvis'],['s1e14','people:ahsoka-tano'],['s1e15','people:68']])assert.equal(representation('series:rebels:'+ep,target),'transmission','A broadcast or remote contact is not a physical visit');
for(const [ep,target] of [['s1e12','people:gall-trayvis'],['s1e13','people:cumberlayne-aresko'],['s1e13','people:myles-grint'],['s1e15','people:ahsoka-tano'],['s1e15','people:4'],['s1e15','people:agent-kallus']])assert.equal(representation('series:rebels:'+ep,target),'direct');
assert.ok(rebels13.episodeReviews[0].links.find(l=>l.targetId==='people:gall-trayvis').note.includes('vision'));
assert.equal(representation('series:rebels:s1e14','planets:13'),undefined,'An announced destination does not establish a current setting');assert.equal(representation('series:rebels:s1e15','planets:13'),'direct');
for(const target of ['starships:sovereign','starships:imperial-light-cruiser','starships:broken-horn'])assert.equal(representation('series:rebels:s1e14',target),'direct');
for(const target of ['starships:ezra-zeb-tie-fighter','starships:inquisitor-tie-prototype','starships:mustafar-rescue-transport'])assert.equal(representation('series:rebels:s1e15',target),'direct');
assert.equal(representation('series:rebels:s1e13','vehicles:patrol-transport'),'direct');
for(const [ep,target] of [['s1e12','people:2'],['s1e12','people:maketh-tua'],['s1e12','people:grand-inquisitor'],['s1e13','vehicles:sabine-speeder-bike'],['s1e13','vehicles:30'],['s1e13','vehicles:50'],['s1e14','starships:gideon-light-cruiser'],['s1e14','starships:relentless'],['s1e14','starships:22'],['s1e15','starships:13'],['s1e15','starships:trask-imperial-freighter'],['s1e15','starships:28'],['s1e15','starships:2'],['s1e15','planets:2']])assert.equal(representation('series:rebels:'+ep,target),undefined,'Related biographies, designs, unnamed hulls and model similarities must not become episode assertions');
assert.equal(representation('series:rebels:s1e1','people:4'),undefined,'Finale evidence does not backfill the original pilot');
const finaleVader=rebels13.episodeReviews[3].links.find(l=>l.targetId==='people:4');assert.ok(finaleVader.evidence.some(e=>e.sourceId==='supp13-kallus-biography'&&e.locator.includes('caption 10')));
const remoteFulcrum=rebels13.episodeReviews[2].links.find(l=>l.targetId==='people:ahsoka-tano');assert.ok(remoteFulcrum.evidence.some(e=>e.locator.includes('Caption 25')),'Season-one identity is explicit, not inferred from later Kallus alias use');
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_reviews v JOIN episodes e ON e.id=v.episode_id WHERE e.record_id='series:rebels' AND e.season=1").get().n,14);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_links l JOIN episodes e ON e.id=l.episode_id WHERE e.record_id='series:rebels' AND e.season=1").get().n,217);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM records WHERE id LIKE '%fulcrum%'").get().n,0,'An alias does not create another identity');
const lightSource=db.prepare("SELECT title,url,note FROM sources WHERE id='supp09-moff-gideon-s-light-cruiser-official-databank'").get();assert.equal(lightSource.url,'https://www.starwars.com/databank/imperial-light-cruiser');assert.equal(lightSource.title,'Imperial Light Cruiser — official Databank');assert.match(lightSource.note,/does not identify/);
for(const r of supplement13.records.filter(r=>r.newRecord))assert.equal(r.facts.length,1,'Introductory profiles do not silently import full technical or biological metadata');

// Supplement 14: combined guides, remote appearances and distinct vehicle/place identities.
const supplement14=supplements.find(b=>b.id==='SUPPLEMENT-14');assert.ok(supplement14);
const rebels14=supplement14.records.find(r=>r.id==='series:rebels');
assert.deepEqual(rebels14.episodeReviews.map(r=>r.episodeId),[1,3,4,5,6].map(n=>`series:rebels:s2e${n}`));
assert.deepEqual(rebels14.episodeReviews.map(r=>r.links.length),[20,14,18,14,14]);
assert.equal(supplement14.records.filter(r=>r.newRecord).length,15);
for(const review of rebels14.episodeReviews){assert.equal(review.consideredTargets.length,100);assert.equal(new Set(review.consideredTargets).size,100);}
const siege14=db.prepare("SELECT number_start,number_end FROM episodes WHERE id='series:rebels:s2e1'").get();assert.deepEqual({...siege14},{number_start:1,number_end:2});assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episodes WHERE id='series:rebels:s2e2'").get().n,0);
for(const [ep,target] of [['s2e1','people:25'],['s2e1','people:21'],['s2e6','people:jun-sato']])assert.equal(representation('series:rebels:'+ep,target),'transmission');
for(const [ep,target] of [['s2e1','people:maketh-tua'],['s2e1','people:ahsoka-tano'],['s2e1','people:4'],['s2e4','people:agent-kallus'],['s2e4','people:fifth-brother'],['s2e4','people:ahsoka-tano'],['s2e5','people:seventh-sister'],['s2e5','people:kassius-konstantine']])assert.equal(representation('series:rebels:'+ep,target),'direct');
for(const ep of ['s2e3','s2e4'])assert.equal(representation('series:rebels:'+ep,'vehicles:modified-at-te'),'direct');
for(const [ep,target] of [['s2e1','people:12'],['s2e1','people:11'],['s2e1','people:morad-sumar'],['s2e1','planets:13'],['s2e1','starships:inquisitor-tie-prototype'],['s2e1','starships:22'],['s2e1','people:imperial-probe-droid'],['s2e3','vehicles:53'],['s2e3','people:chopper'],['s2e4','vehicles:53'],['s2e4','people:4'],['s2e4','planets:9'],['s2e4','vehicles:30'],['s2e5','people:ahsoka-tano'],['s2e5','people:grand-inquisitor'],['s2e5','people:11'],['s2e6','people:25'],['s2e6','planets:garel'],['s2e6','planets:lothal'],['s2e6','starships:merchant-one'],['s2e6','people:zeb-orrelios']])assert.equal(representation('series:rebels:'+ep,target),undefined,'Mentions, outlines, aliases, related biographies and shared designs do not establish released-scene appearances');
assert.equal(representation('series:rebels:s2e1','starships:13'),'direct');assert.equal(representation('series:rebels:s2e1','starships:phoenix-home'),'direct');
assert.equal(representation('series:rebels:s2e4','vehicles:18'),'direct');
assert.match(rebels14.episodeReviews[2].links.find(l=>l.targetId==='vehicles:18').note,/different model/);
assert.match(rebels14.episodeReviews[2].links.find(l=>l.targetId==='species:joopa').note,/cargo/);
assert.match(rebels14.episodeReviews[3].links.find(l=>l.targetId==='starships:ghost').note,/inconsistency/);
assert.match(rebels14.episodeReviews[3].notes.join(' '),/shared design only/);
for(const r of supplement14.records.filter(r=>r.newRecord))assert.equal(r.facts.length,1,'A short supporting profile does not import a full technical or biological dossier');
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_reviews WHERE batch_id IN ('SUPPLEMENT-11','SUPPLEMENT-12','SUPPLEMENT-13','SUPPLEMENT-14')").get().n,19);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_links l JOIN episodes e ON e.id=l.episode_id WHERE e.record_id='series:rebels' AND e.season=1").get().n,217);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_links l JOIN episodes e ON e.id=l.episode_id WHERE e.record_id='series:rebels' AND e.season=2 AND (l.id NOT LIKE 'SUPPLEMENT-%' OR l.id LIKE 'SUPPLEMENT-14:%')").get().n,82);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_links WHERE episode_id LIKE 'series:mandalorian:%'").get().n,206);

// Supplement 15: prototypes, visions and explicitly unresolved appearance forms.
const supplement15=supplements.find(b=>b.id==='SUPPLEMENT-15');assert.ok(supplement15);
const rebels15=supplement15.records.find(r=>r.id==='series:rebels');
assert.deepEqual(rebels15.episodeReviews.map(r=>r.episodeId),[7,8,9,10,11].map(n=>`series:rebels:s2e${n}`));
assert.deepEqual(rebels15.episodeReviews.map(r=>r.links.length),[18,12,14,14,22]);assert.equal(supplement15.records.filter(r=>r.newRecord).length,22);
for(const review of rebels15.episodeReviews){assert.equal(review.consideredTargets.length,124);assert.equal(new Set(review.consideredTargets).size,124);}
for(const target of ['people:ephraim-bridger','people:mira-bridger'])assert.equal(representation('series:rebels:s2e11',target),'vision','Parents in dreams are not physical reunions or categorically Force spirits');
assert.equal(representation('series:rebels:s2e11','people:ryder-azadi'),'direct');assert.equal(representation('series:rebels:s2e11','species:loth-cat'),'direct');
assert.equal(representation('series:rebels:s2e9','people:agent-kallus'),'transmission');assert.equal(representation('series:rebels:s2e11','people:agent-kallus'),'direct');assert.equal(representation('series:rebels:s2e9','people:jun-sato'),'direct');
assert.equal(representation('series:rebels:s2e8','people:68'),'unspecified','Named narrative appearance does not settle physical versus holographic form');assert.match(rebels15.episodeReviews[1].links.find(l=>l.targetId==='people:68').note,/unestablished/);assert.equal(representation('series:rebels:s2e8','people:3'),'direct');
for(const [ep,target] of [['s2e7','starships:blade-wing-prototype'],['s2e7','people:bg-81'],['s2e8','people:eg-86'],['s2e8','people:vaux'],['s2e8','starships:gx1-starbus'],['s2e9','starships:titus-interdictor'],['s2e9','people:interrogation-droid'],['s2e10','planets:garel'],['s2e10','planets:takobo'],['s2e10','people:darja'],['s2e10','people:oora'],['s2e11','starships:liberator'],['s2e11','starships:relentless']])assert.equal(representation('series:rebels:'+ep,target),'direct');
for(const [ep,target] of [['s2e7','starships:29'],['s2e7','people:68'],['s2e7','people:chopper'],['s2e8','people:2'],['s2e8','people:rx-24'],['s2e8','people:courier-droid'],['s2e8','planets:garel'],['s2e8','starships:22'],['s2e8','starships:star-commuter-shuttle'],['s2e9','people:16'],['s2e9','starships:liberator'],['s2e9','starships:22'],['s2e9','starships:relentless'],['s2e10','planets:13'],['s2e10','planets:chandel'],['s2e10','people:4'],['s2e10','people:id9-seeker-droid'],['s2e10','people:imperial-probe-droid'],['s2e10','starships:inquisitor-tie-prototype'],['s2e10','people:hera-syndulla'],['s2e11','people:tseebo'],['s2e11','starships:phoenix-home']])assert.equal(representation('series:rebels:'+ep,target),undefined,'Drafts, mentions, designs, planned destinations and unsupported model identities are not released-scene assertions');
assert.equal(db.prepare("SELECT value FROM facts WHERE record_id='starships:blade-wing-prototype' AND key='model'").get().value,'Prototype B6 / Blade Wing');
assert.ok(rebels15.episodeReviews[4].links.find(l=>l.targetId==='starships:relentless').evidence.some(e=>e.sourceId==='supp15-legacy-trivia'&&e.locator.includes('5')));
for(const r of supplement15.records.filter(r=>r.newRecord))assert.equal(r.facts.length,1,'Introductory profiles do not silently import a whole specification or biography');
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_reviews WHERE batch_id='SUPPLEMENT-15'").get().n,5);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_links WHERE id LIKE 'SUPPLEMENT-15:%'").get().n,80);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_links l JOIN episodes e ON e.id=l.episode_id WHERE e.record_id='series:rebels' AND e.season=1").get().n,217);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_links WHERE episode_id LIKE 'series:mandalorian:%'").get().n,206);

// Supplement 16: identity continuity, exact place scope and retained conflicting sources.
const supplement16=supplements.find(b=>b.id==='SUPPLEMENT-16');assert.ok(supplement16);
const rebels16=supplement16.records.find(r=>r.id==='series:rebels');
assert.deepEqual(rebels16.episodeReviews.map(r=>r.episodeId),[12,13,14,15,16].map(n=>`series:rebels:s2e${n}`));
assert.deepEqual(rebels16.episodeReviews.map(r=>r.links.length),[13,13,12,11,17]);assert.equal(supplement16.records.filter(r=>r.newRecord).length,18);
for(const review of rebels16.episodeReviews){assert.equal(review.consideredTargets.length,148);assert.equal(new Set(review.consideredTargets).size,148);}
assert.equal(representation('series:rebels:s2e16','people:jun-sato'),'transmission');assert.equal(representation('series:rebels:s2e13','people:jun-sato'),'direct');
assert.equal(representation('series:rebels:s2e14','people:agent-kallus'),'direct');assert.match(rebels16.episodeReviews[2].links.find(l=>l.targetId==='people:agent-kallus').note,/own ship/);
assert.equal(representation('series:rebels:s2e12','people:supply-master-lyste'),'direct');assert.equal(db.prepare("SELECT COUNT(*) AS n FROM records WHERE id='people:yogar-lyste'").get().n,0,'Promotion must not create a duplicate person');
assert.ok(rebels16.episodeReviews[0].links.find(l=>l.targetId==='people:supply-master-lyste').evidence.some(e=>e.sourceId==='supp16-yogar-lyste'));
for(const target of ['people:ezra-bridger','people:zeb-orrelios'])assert.ok(rebels16.episodeReviews[1].links.find(l=>l.targetId===target).evidence.some(e=>e.locator.includes('image 1')),'Physical briefing image supplies individually scoped scene evidence');
for(const [ep,target] of [['s2e12','people:68'],['s2e12','people:ephraim-bridger'],['s2e12','people:mira-bridger'],['s2e12','planets:2'],['s2e12','vehicles:at-dp'],['s2e13','planets:53'],['s2e13','people:10'],['s2e13','people:agent-kallus'],['s2e13','starships:liberator'],['s2e14','planets:nixus-hub-218'],['s2e14','people:ahsoka-tano'],['s2e14','people:kanan-jarrus'],['s2e14','people:sabine-wren'],['s2e15','people:zeb-orrelios'],['s2e15','species:loth-cat'],['s2e15','vehicles:8'],['s2e16','starships:phoenix-home'],['s2e16','starships:liberator'],['s2e16','starships:22']])assert.equal(representation('series:rebels:'+ep,target),undefined,'References, crew labels, unresolved sources and similar designs do not silently identify a scene');
assert.match(db.prepare("SELECT value FROM facts WHERE record_id='planets:nixus-hub-218' AND key='source_scope'").get().value,/remains unresolved/);
assert.equal(db.prepare("SELECT value FROM facts WHERE record_id='planets:nixus-hub-218' AND key='classification'").get().value,'Space station; not a world');
assert.match(rebels16.episodeReviews[2].notes[0],/conflicting|not silently|not silently equated/);assert.ok(rebels16.episodeReviews[2].evidence.some(e=>e.sourceId==='supp14-brothers-of-the-broken-horn-trivia'));
assert.match(rebels16.episodeReviews[4].notes[3],/Star Destroyer/);assert.ok(rebels16.episodeReviews[4].links.find(l=>l.targetId==='starships:imperial-light-cruiser').evidence.some(e=>e.sourceId==='supp16-numa'));
assert.equal(db.prepare("SELECT value FROM facts WHERE record_id='planets:protectors-camp' AND key='location'").get().value,'Third moon of the Concord Dawn system');
assert.equal(db.prepare("SELECT review_status FROM facts WHERE record_id='planets:53' AND key='terrain'").get().review_status,'unestablished','PROFILE-10 explicitly assesses the inherited terrain without verifying the planet from a moon camp');
assert.equal(db.prepare("SELECT value FROM facts WHERE record_id='planets:53' AND key='terrain'").get().value,'jungles, forests, deserts','Original unestablished terrain remains recoverable');
assert.equal(db.prepare("SELECT value FROM facts WHERE record_id='starships:captured-quasar-carrier' AND key='model'").get().value,'Quasar Fire-class cruiser-carrier');
assert.equal(db.prepare("SELECT value FROM facts WHERE record_id='people:numa' AND key='height'").get(),undefined,'Childhood height is not projected onto an adult appearance');
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM records WHERE id LIKE '%purrgil-king%' OR id LIKE '%flurry%'").get().n,0);
for(const r of supplement16.records.filter(r=>r.newRecord))assert.equal(r.facts.length,1,'Introductory source-led profiles have an explicit small scope');
for(const [target,id] of [['people:zeb-orrelios','series:rebels:s2e14:link:0'],['starships:ghost','series:rebels:s2e14:link:1']]){assert.equal(db.prepare("SELECT id FROM episode_links WHERE episode_id='series:rebels:s2e14' AND target_id=?").get(target).id,id);assert.equal(representation('series:rebels:s2e14',target),'direct');}
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_reviews WHERE batch_id='SUPPLEMENT-16'").get().n,5);assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_links WHERE id LIKE 'SUPPLEMENT-16:%'").get().n,64,'Two rechecked rows retain their earlier identifiers');
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_links l JOIN episodes e ON e.id=l.episode_id WHERE e.record_id='series:rebels' AND e.season=1").get().n,217);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_links WHERE episode_id LIKE 'series:mandalorian:%'").get().n,206);

// Supplement 17: final season-two guides retain combined and representation boundaries.
const supplement17=supplements.find(b=>b.id==='SUPPLEMENT-17');assert.ok(supplement17);
const rebels17=supplement17.records.find(r=>r.id==='series:rebels');
assert.deepEqual(rebels17.episodeReviews.map(r=>r.episodeId),[17,18,19,20,21].map(n=>`series:rebels:s2e${n}`));
assert.deepEqual(rebels17.episodeReviews.map(r=>r.links.length),[12,13,14,15,17]);
assert.equal(supplement17.records.filter(r=>r.newRecord).length,16);
for(const r of rebels17.episodeReviews){assert.equal(r.consideredTargets.length,165);assert.equal(new Set(r.consideredTargets).size,165);}
assert.equal(representation('series:rebels:s2e18','people:20'),'force_communication');
assert.equal(representation('series:rebels:s2e18','people:11'),'transmission');
assert.equal(representation('series:rebels:s2e18','people:grand-inquisitor'),'vision');
assert.equal(representation('series:rebels:s2e18','people:4'),'direct');
assert.match(rebels17.episodeReviews[1].links.find(l=>l.targetId==='people:11').note,/vision/);
assert.match(rebels17.episodeReviews[1].links.find(l=>l.targetId==='people:4').note,/vision/);
assert.equal(representation('series:rebels:s2e19','people:ketsu-onyo'),'unspecified');
assert.equal(representation('series:rebels:s2e19','people:captain-rex'),'direct');
assert.equal(representation('series:rebels:s2e19','planets:atollon'),'direct');
assert.equal(representation('series:rebels:s2e20','people:lieutenant-dicer'),'direct');
assert.ok(rebels17.episodeReviews[3].links.find(l=>l.targetId==='people:lieutenant-dicer').evidence.some(e=>e.locator.includes('image 7')));
assert.equal(representation('series:rebels:s2e21','people:44'),'direct');
assert.ok(rebels17.episodeReviews[4].links.find(l=>l.targetId==='people:ahsoka-tano').evidence.some(e=>e.locator.includes('50')));
for(const [ep,target] of [['s2e17','starships:9'],['s2e18','planets:9'],['s2e18','planets:malachor'],['s2e18','people:10'],['s2e19','people:ezra-bridger'],['s2e19','people:zeb-orrelios'],['s2e19','planets:37'],['s2e19','starships:shadow-caster'],['s2e20','people:jun-sato'],['s2e20','species:convor'],['s2e21','people:11'],['s2e21','people:21'],['s2e21','starships:inquisitor-tie-prototype']])assert.equal(representation('series:rebels:'+ep,target),undefined,'Mentions, design references and later events do not supply released appearances');
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episodes WHERE id='series:rebels:s2e22'").get().n,0,'Combined finale is not split');
assert.match(db.prepare("SELECT value FROM facts WHERE record_id='planets:bahryn' AND key='classification'").get().value,/moon of Geonosis/);
assert.match(db.prepare("SELECT value FROM facts WHERE record_id='planets:imperial-construction-module' AND key='classification'").get().value,/Orbital space base/);
assert.match(db.prepare("SELECT value FROM facts WHERE record_id='planets:lothal-jedi-temple' AND key='classification'").get().value,/distinct from the Coruscant/);
for(const r of supplement17.records.filter(r=>r.newRecord))assert.equal(r.facts.length,1);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_reviews WHERE batch_id='SUPPLEMENT-17'").get().n,5);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_links WHERE id LIKE 'SUPPLEMENT-17:%'").get().n,71);

// Supplement 18: season-three holograms, revised outlines and distinct replacement craft.
const supplement18=supplements.find(b=>b.id==='SUPPLEMENT-18');assert.ok(supplement18);
const rebels18=supplement18.records.find(r=>r.id==='series:rebels');
assert.deepEqual(rebels18.episodeReviews.map(r=>r.episodeId),[1,3,4,5,6].map(n=>`series:rebels:s3e${n}`));
assert.deepEqual(rebels18.episodeReviews.map(r=>r.links.length),[22,13,20,14,13]);
assert.equal(supplement18.records.filter(r=>r.newRecord).length,24);
for(const r of rebels18.episodeReviews){assert.equal(r.consideredTargets.length,195);assert.equal(new Set(r.consideredTargets).size,195);}
assert.equal(representation('series:rebels:s3e1','people:grand-admiral-thrawn'),'transmission');
assert.equal(representation('series:rebels:s3e5','people:grand-admiral-thrawn'),'direct');
assert.equal(representation('series:rebels:s3e4','people:instructor-goran'),'unspecified');
assert.equal(representation('series:rebels:s3e6','people:hera-syndulla'),'unspecified');
for(const [ep,target] of [['s3e1','starships:phantom-original'],['s3e3','starships:a-wing-trainer'],['s3e4','vehicles:26'],['s3e4','starships:17'],['s3e5','species:blurrg'],['s3e6','starships:phantom-ii'],['s3e6','starships:sheathipede-shuttle'],['s3e6','people:general-kalani'],['s3e6','people:super-tactical-droid'],['s3e6','vehicles:18']])assert.equal(representation('series:rebels:'+ep,target),'direct');
for(const [ep,target] of [['s3e1','starships:ghost'],['s3e1','starships:captured-quasar-carrier'],['s3e1','species:krykna'],['s3e3','starships:nightbrother'],['s3e3','starships:28'],['s3e3','people:10'],['s3e3','planets:1'],['s3e4','people:9'],['s3e4','people:ahsoka-tano'],['s3e4','starships:ghost'],['s3e5','species:gutkurr'],['s3e6','people:chopper'],['s3e6','starships:ghost'],['s3e6','starships:phantom-original']])assert.equal(representation('series:rebels:'+ep,target),undefined,'Mentions, discarded outlines, alias icons and unresolved hulls are not released appearances');
assert.match(rebels18.episodeReviews[0].links.find(l=>l.targetId==='starships:11').note,/hyperdrive/i);
assert.match(supplement18.records.find(r=>r.id==='people:hobbie-klivian').limitations.join(' '),/Biggs/);
assert.ok(rebels18.episodeReviews[4].links.find(l=>l.targetId==='vehicles:18').evidence.some(e=>e.locator.includes('image 10')));
assert.deepEqual({...db.prepare("SELECT number_start,number_end FROM episodes WHERE id='series:rebels:s3e1'").get()},{number_start:1,number_end:2});
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episodes WHERE id IN ('series:rebels:s3e2','series:rebels:s3e51')").get().n,0);
for(const r of supplement18.records.filter(r=>r.newRecord))assert.equal(r.facts.length,1,'An introductory profile does not validate a complete dossier');
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_reviews WHERE batch_id='SUPPLEMENT-18'").get().n,5);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_links WHERE id LIKE 'SUPPLEMENT-18:%'").get().n,82);

// Supplement 19: published scene identities, caption discrepancies and plans versus actual craft.
const supplement19=supplements.find(b=>b.id==='SUPPLEMENT-19');assert.ok(supplement19);
const rebels19=supplement19.records.find(r=>r.id==='series:rebels');
assert.deepEqual(rebels19.episodeReviews.map(r=>r.episodeId),[7,8,9,10,11].map(n=>`series:rebels:s3e${n}`));
assert.deepEqual(rebels19.episodeReviews.map(r=>r.links.length),[10,16,13,17,9]);
assert.equal(supplement19.records.filter(r=>r.newRecord).length,15);
assert.equal(supplement19.sources.length,24);
for(const r of rebels19.episodeReviews){assert.equal(r.consideredTargets.length,211);assert.equal(new Set(r.consideredTargets).size,211);}
for(const [ep,target] of [['s3e7','starships:phantom-ii'],['s3e7','planets:protectors-camp'],['s3e8','people:grand-admiral-thrawn'],['s3e8','people:kassius-konstantine'],['s3e8','starships:satos-hammer'],['s3e9','people:imperial-sentry-droid'],['s3e9','starships:imperial-cargo-ship'],['s3e10','people:governor-pryce'],['s3e10','people:sabine-wren'],['s3e10','planets:thrawns-office'],['s3e10','vehicles:at-dp'],['s3e10','vehicles:18'],['s3e11','people:44'],['s3e11','planets:36'],['s3e11','planets:maul-dathomir-sanctuary']])assert.equal(representation('series:rebels:'+ep,target),'direct');
assert.equal(representation('series:rebels:s3e8','people:jun-sato'),'unspecified');
for(const [ep,target] of [['s3e7','planets:mandalore'],['s3e7','people:imperial-probe-droid'],['s3e7','starships:phantom-original'],['s3e8','starships:liberator'],['s3e9','starships:last-chance'],['s3e9','people:ap-5'],['s3e9','people:general-kalani'],['s3e10','starships:tie-defender'],['s3e10','people:ahsoka-tano'],['s3e10','planets:atollon'],['s3e11','starships:nightbrother'],['s3e11','starships:phantom-ii'],['s3e11','people:10'],['s3e11','planets:1'],['s3e11','people:b1-battle-droid']])assert.equal(representation('series:rebels:'+ep,target),undefined,'Mentioned worlds, artifacts, plans, design ancestors and unresolved hulls are not actual appearances');
assert.match(rebels19.episodeReviews[0].notes.join(' '),/third moon/);
assert.match(rebels19.episodeReviews[3].notes.join(' '),/311.*310/);
assert.match(rebels19.episodeReviews[4].notes.join(' '),/Caption 7.*caption 9.*trivia 7/i);
assert.match(rebels19.episodeReviews[4].links.find(l=>l.targetId==='people:44').note,/visions.*physical/i);
assert.ok(rebels19.episodeReviews[3].links.find(l=>l.targetId==='people:governor-pryce').evidence.some(e=>e.locator.includes('image 6')));
assert.ok(rebels19.episodeReviews[3].links.find(l=>l.targetId==='people:sabine-wren').evidence.some(e=>e.locator.includes('image 9')));
for(const r of supplement19.records.filter(r=>r.newRecord))assert.equal(r.facts.length,1,'Introductory scope does not certify a complete dossier');
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_reviews WHERE batch_id='SUPPLEMENT-19'").get().n,5);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_links WHERE id LIKE 'SUPPLEMENT-19:%'").get().n,65);

// Supplement 20: mixed gallery evidence, blank caption, historic art and separate shipboard office.
const supplement20=supplements.find(b=>b.id==='SUPPLEMENT-20');assert.ok(supplement20);
const rebels20=supplement20.records.find(r=>r.id==='series:rebels');
assert.deepEqual(rebels20.episodeReviews.map(r=>r.episodeId),[12,14,15,16,17].map(n=>`series:rebels:s3e${n}`));
assert.deepEqual(rebels20.episodeReviews.map(r=>r.links.length),[19,10,6,11,13]);
assert.equal(supplement20.records.filter(r=>r.newRecord).length,14);assert.equal(supplement20.sources.length,23);
for(const r of rebels20.episodeReviews){assert.equal(r.consideredTargets.length,226);assert.equal(new Set(r.consideredTargets).size,226);}
for(const [ep,target] of [['s3e12','people:jun-sato'],['s3e12','people:68'],['s3e15','people:hera-syndulla']])assert.equal(representation('series:rebels:'+ep,target),'transmission');
for(const [ep,target] of [['s3e12','people:captain-rex'],['s3e12','people:zeb-orrelios'],['s3e12','people:captain-brunson'],['s3e12','people:jumptroopers'],['s3e12','species:28'],['s3e12','starships:imperial-light-cruiser'],['s3e14','people:agent-kallus'],['s3e14','people:e-xd-infiltrator-droid'],['s3e14','starships:tactical-infiltration-pod'],['s3e14','starships:3'],['s3e16','people:clan-wren'],['s3e16','people:imperial-super-commandos'],['s3e16','planets:krownest'],['s3e16','planets:wren-stronghold'],['s3e17','people:wullf-yularen'],['s3e17','planets:thrawn-shipboard-office'],['s3e17','starships:3']])assert.equal(representation('series:rebels:'+ep,target),'direct');
for(const [ep,target] of [['s3e12','starships:9'],['s3e12','planets:atollon'],['s3e12','people:chopper'],['s3e12','planets:imperial-construction-module'],['s3e14','people:captain-rex'],['s3e14','people:18'],['s3e14','people:hobbie-klivian'],['s3e14','vehicles:flash-speeder'],['s3e14','people:imperial-probe-droid'],['s3e14','planets:4'],['s3e15','people:bendu'],['s3e15','people:25'],['s3e15','people:ketsu-onyo'],['s3e15','species:purrgil'],['s3e15','species:puffer-pig'],['s3e16','planets:mandalore'],['s3e16','people:alrich-wren'],['s3e16','people:chopper'],['s3e16','starships:phantom-ii'],['s3e17','planets:thrawns-office'],['s3e17','planets:atollon'],['s3e17','people:imperial-sentry-droid'],['s3e17','starships:22']])assert.equal(representation('series:rebels:'+ep,target),undefined,'Drawings, abandoned outlines, unvisited destinations, unresolved models and different rooms do not become actual selected appearances');
assert.match(rebels20.episodeReviews[0].notes.join(' '),/Caption 7.*Rex.*Zeb/s);assert.match(rebels20.episodeReviews[1].notes.join(' '),/Position 6 is blank/);
assert.match(rebels20.episodeReviews[1].links.find(l=>l.targetId==='people:agent-kallus').note,/Remote warning plus physical scene/);
assert.ok(rebels20.episodeReviews[1].links.find(l=>l.targetId==='people:agent-kallus').evidence.some(e=>e.sourceId==='supp20-through-imperial-eyes-gallery'&&e.locator.includes('image 2')));
assert.ok(rebels20.episodeReviews[3].links.find(l=>l.targetId==='people:gar-saxon').evidence.some(e=>e.sourceId==='supp19-gar-saxon'&&e.locator.includes('explicit death')));
assert.match(rebels20.episodeReviews[4].notes[0],/S3 E17.*eighteenth slot/);
assert.deepEqual({...db.prepare("SELECT number_start,number_end FROM episodes WHERE id='series:rebels:s3e12'").get()},{number_start:12,number_end:13});assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episodes WHERE id='series:rebels:s3e13'").get().n,0);assert.equal(db.prepare("SELECT title FROM episodes WHERE id='series:rebels:s3e18'").get().title,'Secret Cargo');
assert.match(db.prepare("SELECT value FROM facts WHERE record_id='planets:thrawn-shipboard-office' AND key='location'").get().value,/Aboard Thrawn/);assert.match(db.prepare("SELECT value FROM facts WHERE record_id='planets:thrawns-office' AND key='location'").get().value,/Lothal Imperial Factory/);
assert.ok(rebels20.links.find(l=>l.targetId==='vehicles:flash-speeder').evidence.some(e=>e.note.includes('Series-level use only')));
for(const r of supplement20.records.filter(r=>r.newRecord))assert.equal(r.facts.length,1,'Introductory evidence does not certify a complete dossier');
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_reviews WHERE batch_id='SUPPLEMENT-20'").get().n,5);assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_links WHERE id LIKE 'SUPPLEMENT-20:%'").get().n,59);

// Supplement 21: complete season-three guide coverage, scene forms and non-interchangeable hulls.
const supplement21=supplements.find(b=>b.id==='SUPPLEMENT-21');assert.ok(supplement21);
const rebels21=supplement21.records.find(r=>r.id==='series:rebels');
assert.deepEqual(rebels21.episodeReviews.map(r=>r.episodeId),[18,19,20,21].map(n=>`series:rebels:s3e${n}`));
assert.deepEqual(rebels21.episodeReviews.map(r=>r.links.length),[21,11,13,31]);
assert.equal(supplement21.records.filter(r=>r.newRecord).length,15);assert.equal(supplement21.sources.length,21);
for(const r of rebels21.episodeReviews){assert.equal(r.consideredTargets.length,247);assert.equal(new Set(r.consideredTargets).size,247);}
for(const [ep,target] of [['s3e18','people:28'],['s3e18','people:e-xd-infiltrator-droid'],['s3e18','starships:tie-defender'],['s3e18','planets:25'],['s3e18','starships:27'],['s3e18','starships:23'],['s3e19','people:18'],['s3e19','people:controller-lt-319'],['s3e19','planets:killun-71'],['s3e19','planets:killun-station'],['s3e19','species:neebray'],['s3e20','people:10'],['s3e20','people:kanan-jarrus'],['s3e20','people:1'],['s3e20','people:tusken-raiders'],['s3e20','species:dewback'],['s3e20','planets:atollon'],['s3e21','people:agent-kallus'],['s3e21','people:jan-dodonna'],['s3e21','people:ursa-wren'],['s3e21','people:tristan-wren'],['s3e21','people:imperial-death-troopers'],['s3e21','starships:atollon-blockade-interdictors'],['s3e21','starships:dornean-gunship'],['s3e21','vehicles:18']])assert.equal(representation('series:rebels:'+ep,target),'direct');
for(const target of ['people:governor-pryce','people:kassius-konstantine','people:jan-dodonna'])assert.equal(representation('series:rebels:s3e18',target),'unspecified');
for(const target of ['people:12','people:28'])assert.equal(representation('series:rebels:s3e21',target),'transmission');
for(const [ep,target] of [['s3e18','people:imperial-probe-droid'],['s3e18','starships:tactical-infiltration-pod'],['s3e18','starships:17'],['s3e18','starships:chandrila-mistress'],['s3e18','vehicles:26'],['s3e18','species:8'],['s3e19','people:26'],['s3e19','planets:lothal'],['s3e19','planets:atollon'],['s3e19','starships:phantom-ii'],['s3e19','starships:imperial-cargo-ship'],['s3e20','people:moota-engatoo'],['s3e20','people:7'],['s3e20','starships:a-wing-trainer'],['s3e20','starships:nightbrother'],['s3e20','starships:ghost'],['s3e21','starships:titus-interdictor'],['s3e21','starships:phoenix-home'],['s3e21','starships:captured-quasar-carrier'],['s3e21','starships:tie-defender'],['s3e21','planets:3'],['s3e21','species:purrgil'],['s3e21','vehicles:at-dp']])assert.equal(representation('series:rebels:'+ep,target),undefined,'Generic words, unvisited targets, cut concepts, model reuse and unjoined hull identities do not establish selected physical appearances');
assert.ok(rebels21.episodeReviews[0].links.find(l=>l.targetId==='people:e-xd-infiltrator-droid').evidence.some(e=>e.locator.includes('image 2')));
assert.ok(rebels21.episodeReviews[0].links.find(l=>l.targetId==='planets:25').evidence.some(e=>e.sourceId==='supp21-mothma-dantooine'&&e.locator.includes('above Dantooine')));
assert.ok(rebels21.episodeReviews[0].links.find(l=>l.targetId==='people:jan-dodonna').evidence.some(e=>e.sourceId==='supp21-zero-hour-trivia'&&e.locator.includes('Trivia 2')));
assert.match(rebels21.episodeReviews[2].links.find(l=>l.targetId==='people:10').note,/recorded warning.*physical camp/);
assert.match(rebels21.episodeReviews[2].links.find(l=>l.targetId==='people:kanan-jarrus').note,/Physical Atollon.*abandoned Tatooine/);
assert.match(rebels21.episodeReviews[2].links.find(l=>l.targetId==='people:1').note,/Luke.*Ezra.*identities/);
for(const target of ['people:ursa-wren','people:tristan-wren'])assert.ok(rebels21.episodeReviews[3].links.find(l=>l.targetId===target).evidence.some(e=>e.sourceId==='supp20-clan-wren'&&e.locator.includes('named released group image')));
assert.match(rebels21.episodeReviews[3].notes.join(' '),/Phoenix Nest.*Phoenix Home.*captured-Quasar/s);
assert.match(supplement21.records.find(r=>r.id==='starships:atollon-blockade-interdictors').limitations.join(' '),/Titus.*destroyed/);
assert.ok(rebels21.links.find(l=>l.targetId==='starships:chandrila-mistress').evidence.some(e=>e.note.includes('Series-level identity only')));
assert.deepEqual({...db.prepare("SELECT number_start,number_end FROM episodes WHERE id='series:rebels:s3e21'").get()},{number_start:21,number_end:22});
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episodes WHERE id='series:rebels:s3e22'").get().n,0);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episodes e JOIN episode_reviews v ON v.episode_id=e.id WHERE e.record_id='series:rebels' AND e.season=3").get().n,19);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_reviews WHERE batch_id='SUPPLEMENT-21'").get().n,4);assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_links WHERE id LIKE 'SUPPLEMENT-21:%'").get().n,76);
for(const r of supplement21.records.filter(r=>r.newRecord))assert.equal(r.facts.length,1,'Introductory profiles are not complete dossiers');

// Supplement 22: combined guides, named identities, actual scene forms and variant boundaries.
const supplement22=supplements.find(b=>b.id==='SUPPLEMENT-22');assert.ok(supplement22);
const rebels22=supplement22.records.find(r=>r.id==='series:rebels');
assert.deepEqual(rebels22.episodeReviews.map(r=>r.episodeId),[1,3,5,6,7].map(n=>`series:rebels:s4e${n}`));
assert.deepEqual(rebels22.episodeReviews.map(r=>r.links.length),[14,25,14,15,10]);
assert.equal(supplement22.records.filter(r=>r.newRecord).length,19);assert.equal(supplement22.sources.length,26);
for(const r of rebels22.episodeReviews){assert.equal(r.consideredTargets.length,269);assert.equal(new Set(r.consideredTargets).size,269);}
for(const [ep,target] of [['s4e1','people:alrich-wren'],['s4e1','people:tiber-saxon'],['s4e1','people:captain-hark'],['s4e1','people:bo-katan-kryze'],['s4e1','people:ursa-wren'],['s4e1','people:tristan-wren'],['s4e1','planets:mandalore'],['s4e3','people:saw-gerrera'],['s4e3','people:r4-c2'],['s4e3','people:edrio-two-tubes'],['s4e3','people:dt-f16'],['s4e3','people:mich-matt'],['s4e3','people:brom-titus'],['s4e3','planets:jalindi'],['s4e3','planets:jalindi-station'],['s4e3','planets:faos-station'],['s4e3','starships:freighter-2716'],['s4e3','starships:u-wing'],['s4e5','people:ryder-azadi'],['s4e5','people:valen-rudor'],['s4e5','vehicles:tx-225-gavr'],['s4e5','species:puffer-pig'],['s4e6','starships:tie-defender-elite'],['s4e6','planets:lothal-imperial-airfield'],['s4e6','people:imperial-probe-droid'],['s4e6','people:jai-kell'],['s4e6','species:loth-wolf'],['s4e7','species:loth-wolf'],['s4e7','species:noghri'],['s4e7','people:rukh'],['s4e7','people:grand-admiral-thrawn'],['s4e7','people:governor-pryce']])assert.equal(representation('series:rebels:'+ep,target),'direct');
assert.equal(representation('series:rebels:s4e3','people:68'),'transmission');
assert.equal(representation('series:rebels:s4e1','people:grand-admiral-thrawn'),'unspecified');assert.equal(representation('series:rebels:s4e7','people:28'),'unspecified');
for(const [ep,target] of [['s4e1','people:gar-saxon'],['s4e1','people:saw-gerrera'],['s4e3','starships:titus-interdictor'],['s4e3','starships:9'],['s4e3','starships:imperial-light-cruiser'],['s4e3','people:gooti-terez'],['s4e5','people:old-jho'],['s4e5','people:nazhros-oleg'],['s4e5','starships:tie-defender'],['s4e5','planets:lothal-imperial-factory'],['s4e6','people:e-xd-infiltrator-droid'],['s4e6','vehicles:26'],['s4e6','starships:u-wing'],['s4e7','starships:tie-defender-elite'],['s4e7','starships:u-wing'],['s4e7','planets:3'],['s4e7','people:maketh-tua']])assert.equal(representation('series:rebels:'+ep,target),undefined,'Deleted ideas, later reports, aliases, salvaged components and generic hulls do not create selected appearances');
assert.match(rebels22.episodeReviews[0].notes.join(' '),/caption 3.*Wren.*Bo-Katan/s);
assert.match(rebels22.episodeReviews[1].links.find(l=>l.targetId==='people:saw-gerrera').note,/transmission.*physical/);
assert.ok(rebels22.episodeReviews[1].links.find(l=>l.targetId==='people:edrio-two-tubes').evidence.some(e=>e.sourceId==='supp22-edrio-two-tubes'&&e.locator.includes('First direct Rebels history')));
assert.match(rebels22.episodeReviews[1].notes.join(' '),/Faos.*Taos.*Wells/s);
assert.match(rebels22.episodeReviews[2].links.find(l=>l.targetId==='people:ryder-azadi').note,/transmission.*physical/);
assert.ok(rebels22.episodeReviews[2].links.find(l=>l.targetId==='vehicles:tx-225-gavr').evidence.some(e=>e.locator.includes('Trivia 5')));
assert.match(supplement22.records.find(r=>r.id==='vehicles:tx-225-gavr').facts[0].value,/GAVr.*hovering/);
assert.ok(rebels22.episodeReviews[3].links.find(l=>l.targetId==='people:imperial-probe-droid').evidence.some(e=>e.locator.includes('Trivia 5')));
assert.match(rebels22.episodeReviews[3].notes.join(' '),/position 2 is blank/);
assert.ok(rebels22.episodeReviews[4].links.find(l=>l.targetId==='people:grand-admiral-thrawn').evidence.some(e=>e.locator.includes('released image 5')));
assert.ok(rebels22.episodeReviews[4].links.find(l=>l.targetId==='people:governor-pryce').evidence.some(e=>e.locator.includes('released image 3')));
assert.match(rebels22.episodeReviews[4].links.find(l=>l.targetId==='species:noghri').note,/named member/);
assert.match(rebels22.episodeReviews[4].notes.join(' '),/Caleb Dume.*same|Caleb Dume.*Kanan/s);
for(const [id,start,end] of [['series:rebels:s4e1',1,2],['series:rebels:s4e3',3,4]])assert.deepEqual({...db.prepare('SELECT number_start,number_end FROM episodes WHERE id=?').get(id)},{number_start:start,number_end:end});
assert.equal(db.prepare("SELECT COUNT(*) n FROM episodes WHERE id IN ('series:rebels:s4e2','series:rebels:s4e4')").get().n,0);
assert.equal(db.prepare("SELECT COUNT(*) n FROM episode_reviews WHERE batch_id='SUPPLEMENT-22'").get().n,5);assert.equal(db.prepare("SELECT COUNT(*) n FROM episode_links WHERE id LIKE 'SUPPLEMENT-22:%'").get().n,78);
assert.equal(db.prepare("SELECT COUNT(*) n FROM episodes e JOIN episode_reviews v ON v.episode_id=e.id WHERE e.record_id='series:rebels' AND e.season=4").get().n,13);
for(const r of supplement22.records.filter(r=>r.newRecord))assert.equal(r.facts.length,1);

// Supplement 23: named wolves, recorded speech, actual rescue and source-number conflicts.
const supplement23=supplements.find(b=>b.id==='SUPPLEMENT-23');assert.ok(supplement23);
const rebels23=supplement23.records.find(r=>r.id==='series:rebels');
assert.deepEqual(rebels23.episodeReviews.map(r=>r.episodeId),[8,9,10,11,12].map(n=>`series:rebels:s4e${n}`));
assert.deepEqual(rebels23.episodeReviews.map(r=>r.links.length),[16,13,13,12,12]);
assert.equal(supplement23.records.filter(r=>r.newRecord).length,12);assert.equal(supplement23.sources.length,21);
assert.equal(supplement23.records.reduce((n,r)=>n+r.facts.length,0),14);
for(const r of rebels23.episodeReviews){assert.equal(r.consideredTargets.length,284);assert.equal(new Set(r.consideredTargets).size,284);}
for(const [ep,target] of [['s4e8','vehicles:ore-crawler'],['s4e8','people:seevor'],['s4e8','people:proach'],['s4e8','species:7'],['s4e8','people:mining-guild-security-droid'],['s4e8','people:28'],['s4e8','planets:3'],['s4e9','starships:12'],['s4e9','starships:tie-defender-elite'],['s4e9','species:lutrillian'],['s4e9','people:mart-mattin'],['s4e10','vehicles:loth-bat-glider'],['s4e10','species:loth-bat'],['s4e10','planets:lothal-fuel-depot'],['s4e10','people:interrogation-droid'],['s4e11','people:rukh'],['s4e11','people:governor-pryce'],['s4e12','people:veris-hydan'],['s4e12','vehicles:mining-guild-excavation-driller'],['s4e12','planets:lothal-jedi-temple'],['s4e12','people:hera-syndulla']])assert.equal(representation('series:rebels:'+ep,target),'direct');
assert.equal(representation('series:rebels:s4e10','people:kanan-jarrus'),'unspecified','The inherited row is preserved, not silently overwritten');
assert.equal(representation('series:rebels:s4e10','planets:lothal'),'unspecified');
assert.equal(representation('series:rebels:s4e10','people:12'),'unspecified','Dialogue does not independently identify a body versus projection');
assert.equal(representation('series:rebels:s4e11','people:dume-loth-wolf'),'unspecified','A named encounter with unknown origin is not a certified Kanan spirit');
for(const [ep,target] of [['s4e11','people:grand-admiral-thrawn'],['s4e12','people:21'],['s4e12','people:grand-admiral-thrawn']])assert.equal(representation('series:rebels:'+ep,target),'transmission');
assert.match(rebels23.episodeReviews[4].links.find(l=>l.targetId==='people:grand-admiral-thrawn').note,/Recorded voice.*not a current live/);
assert.ok(rebels23.episodeReviews[4].links.find(l=>l.targetId==='people:grand-admiral-thrawn').evidence.some(e=>e.sourceId==='supp23-wolves-and-a-door-trivia'&&e.locator.includes('Trivia 4')));
assert.ok(rebels23.episodeReviews[3].links.find(l=>l.targetId==='people:grand-admiral-thrawn').evidence.some(e=>e.locator.includes('released image 4')));
for(const [ep,target] of [['s4e8','vehicles:4'],['s4e8','starships:tie-defender-elite'],['s4e8','planets:lothal-imperial-factory'],['s4e9','people:cleat'],['s4e9','people:r3-a3'],['s4e9','people:dume-loth-wolf'],['s4e9','planets:lothal-fuel-depot'],['s4e10','vehicles:18'],['s4e10','vehicles:at-dp'],['s4e10','vehicles:patrol-transport'],['s4e10','people:21'],['s4e10','planets:9'],['s4e11','people:kanan-jarrus'],['s4e11','planets:lothal-jedi-temple'],['s4e11','planets:lothal-imperial-factory'],['s4e12','people:kanan-jarrus'],['s4e12','people:dume-loth-wolf'],['s4e12','species:convor'],['s4e12','people:ahsoka-tano']])assert.equal(representation('series:rebels:'+ep,target),undefined,'Plans, data, art, unclassified scene vehicles and unidentified voices are not certified selected appearances');
assert.equal(db.prepare("SELECT COUNT(*) n FROM records WHERE id IN ('people:secon-daree','people:vanee','starships:world-devastator')").get().n,0);
assert.equal(db.prepare("SELECT value FROM facts WHERE record_id='people:cleat' AND key='call_sign'").get().value,'Phoenix Four');
assert.equal(db.prepare("SELECT value FROM facts WHERE record_id='people:proach' AND key='classification'").get().value,'Trandoshan');
assert.equal(db.prepare("SELECT value FROM facts WHERE record_id='people:dume-loth-wolf' AND key='classification'").get().value,'Loth-wolf');
assert.equal(db.prepare("SELECT COUNT(*) n FROM links WHERE record_id='people:dume-loth-wolf' AND target_id='people:kanan-jarrus'").get().n,0);
assert.match(supplement23.records.find(r=>r.id==='people:dume-loth-wolf').limitations.join(' '),/Origin and exact nature remain unresolved/);
assert.equal(db.prepare("SELECT value FROM facts WHERE record_id='vehicles:mining-guild-excavation-driller' AND key='operators'").get().value,'1');
assert.equal(db.prepare("SELECT COUNT(*) n FROM facts WHERE record_id='vehicles:mining-guild-excavation-driller' AND key='passengers'").get().n,0);
assert.match(db.prepare("SELECT value FROM facts WHERE record_id='people:kanan-jarrus' AND key='fate'").get().value,/Dies protecting.*fuel-depot/);
assert.match(db.prepare("SELECT value FROM facts WHERE record_id='series:rebels' AND key='classic_xwing_debut'").get().value,/Rebel Assault.*first classic/);
for(const [id,n] of [['series:rebels:s4e8',8],['series:rebels:s4e9',9]])assert.equal(db.prepare('SELECT number_start FROM episodes WHERE id=?').get(id).number_start,n);
assert.match(rebels23.episodeReviews[0].notes.join(' '),/S4E9.*s4e8/s);assert.match(rebels23.episodeReviews[1].notes.join(' '),/S4E15.*s4e9/s);
for(const r of supplement23.records.filter(r=>r.newRecord))assert.equal(r.facts.length,1,'Introductions do not certify complete dossiers');
assert.equal(db.prepare("SELECT COUNT(*) n FROM episode_reviews WHERE batch_id='SUPPLEMENT-23'").get().n,5);
assert.equal(db.prepare("SELECT COUNT(*) n FROM episode_links WHERE id LIKE 'SUPPLEMENT-23:%'").get().n,66);
assert.equal(db.prepare("SELECT COUNT(*) n FROM episodes e JOIN episode_reviews v ON v.episode_id=e.id WHERE e.record_id='series:rebels'").get().n,66);
assert.equal(db.prepare("SELECT COUNT(*) n FROM episode_links l JOIN episodes e ON e.id=l.episode_id WHERE e.record_id='series:rebels' AND e.season=4").get().n,222);

// Supplement 24: temporal views, magical remote contact and a separate later epilogue.
const supplement24=supplements.find(b=>b.id==='SUPPLEMENT-24');assert.ok(supplement24);
const rebels24=supplement24.records.find(r=>r.id==='series:rebels');
assert.deepEqual(rebels24.episodeReviews.map(r=>r.episodeId),[13,14,15].map(n=>`series:rebels:s4e${n}`));
assert.deepEqual(rebels24.episodeReviews.map(r=>r.links.length),[20,23,33]);
assert.equal(supplement24.records.filter(r=>r.newRecord).length,8);assert.equal(supplement24.sources.length,14);
assert.equal(supplement24.records.reduce((n,r)=>n+r.facts.length,0),12);
for(const r of rebels24.episodeReviews){assert.equal(r.consideredTargets.length,293);assert.equal(new Set(r.consideredTargets).size,293);}
for(const [ep,target] of [['s4e13','people:ahsoka-tano'],['s4e13','people:morai'],['s4e13','species:convor'],['s4e13','planets:world-between-worlds'],['s4e13','people:veris-hydan'],['s4e14','vehicles:joopa-base'],['s4e14','vehicles:18'],['s4e14','planets:seelos'],['s4e14','vehicles:ore-crawler'],['s4e14','people:gregor'],['s4e14','people:commander-wolffe'],['s4e14','people:ketsu-onyo'],['s4e15','starships:chimaera'],['s4e15','planets:lothal-imperial-headquarters'],['s4e15','people:jacen-syndulla'],['s4e15','people:imperial-royal-guard'],['s4e15','species:purrgil'],['s4e15','planets:lira-san'],['s4e15','people:ahsoka-tano']])assert.equal(representation('series:rebels:'+ep,target),'direct');
for(const target of ['people:4','people:kanan-jarrus','planets:malachor'])assert.equal(representation('series:rebels:s4e13',target),'flashback','Earlier portal event, not a current visit or revived body');
for(const target of ['people:20','people:10','people:32','people:dume-loth-wolf'])assert.equal(representation('series:rebels:s4e13',target),'unspecified');
assert.equal(representation('series:rebels:s4e13','people:21'),'force_communication');assert.equal(representation('series:rebels:s4e15','people:21'),'transmission');
for(const target of ['people:ephraim-bridger','people:mira-bridger'])assert.equal(representation('series:rebels:s4e15',target),'unspecified','Stored image plus tempting doorway does not certify resurrected parents');
for(const [ep,target] of [['s4e13','people:maketh-tua'],['s4e13','vehicles:mobile-command-center'],['s4e14','vehicles:modified-at-te'],['s4e14','species:fyrnock'],['s4e14','starships:chimaera'],['s4e14','starships:10'],['s4e14','people:dume-loth-wolf'],['s4e15','planets:7'],['s4e15','planets:peridea'],['s4e15','planets:world-between-worlds'],['s4e15','people:kanan-jarrus']])assert.equal(representation('series:rebels:'+ep,target),undefined,'Narrated history, reused design, unspecified hulls and an unentered portal do not create selected current settings/participants');
const ending24=rebels24.episodeReviews[2];
assert.match(ending24.links.find(l=>l.targetId==='people:ezra-bridger').note,/recorded farewell.*not a second live/s);
assert.match(ending24.links.find(l=>l.targetId==='people:ahsoka-tano').note,/Not at the main/);
assert.match(ending24.links.find(l=>l.targetId==='planets:lira-san').note,/Epilogue trip/);
assert.match(ending24.links.find(l=>l.targetId==='planets:lothal-jedi-temple').note,/Fragment.*not a new visit/);
assert.ok(ending24.links.find(l=>l.targetId==='starships:chimaera').evidence.some(e=>e.sourceId==='supp24-family-reunion-and-farewell-trivia'&&e.locator.includes('Trivia 2')));
assert.equal(db.prepare("SELECT value FROM facts WHERE record_id='vehicles:joopa-base' AND key='base_vehicle'").get().value,'Repurposed AT-AT walker');
assert.equal(db.prepare("SELECT COUNT(*) n FROM facts WHERE record_id='vehicles:joopa-base' AND key IN ('height','crew','passengers')").get().n,0);
assert.equal(db.prepare("SELECT category FROM records WHERE id='planets:world-between-worlds'").get().category,'planets');
assert.equal(db.prepare("SELECT COUNT(*) n FROM facts WHERE record_id='planets:world-between-worlds' AND key IN ('diameter','rotation_period')").get().n,0,'A realm in the Worlds collection is not an astronomical planet');
assert.equal(db.prepare("SELECT value FROM facts WHERE record_id='people:morai' AND key='classification'").get().value,'Convor');
assert.equal(db.prepare("SELECT COUNT(*) n FROM links WHERE record_id='people:morai' AND relation='identity'").get().n,0);
assert.match(db.prepare("SELECT value FROM facts WHERE record_id='people:dume-loth-wolf' AND key='attributed_interpretation'").get().value,/Ahsoka suggests/);
assert.equal(db.prepare("SELECT COUNT(*) n FROM links WHERE record_id='people:dume-loth-wolf' AND target_id='people:kanan-jarrus'").get().n,0);
assert.match(db.prepare("SELECT value FROM facts WHERE record_id='people:gregor' AND key='fate'").get().value,/Dies.*injuries/);
assert.match(db.prepare("SELECT value FROM facts WHERE record_id='people:rukh' AND key='fate'").get().value,/shield generator/);
assert.match(db.prepare("SELECT value FROM facts WHERE record_id='people:governor-pryce' AND key='fate'").get().value,/refusing evacuation/);
assert.equal(db.prepare("SELECT COUNT(*) n FROM facts WHERE record_id='people:melch' AND key='fate'").get().n,0,'Do not confuse Melch’s survival with Gregor’s death');
assert.equal(db.prepare("SELECT COUNT(*) n FROM facts WHERE record_id='people:jacen-syndulla' AND key IN ('height','birth_year')").get().n,0,'An unqualified later dimension must not be assigned to the epilogue child');
assert.deepEqual({...db.prepare("SELECT number_start,number_end FROM episodes WHERE id='series:rebels:s4e15'").get()},{number_start:15,number_end:16});
assert.equal(db.prepare("SELECT COUNT(*) n FROM episodes WHERE id='series:rebels:s4e16'").get().n,0);
assert.equal(db.prepare("SELECT number_start FROM episodes WHERE id='series:rebels:s4e14'").get().number_start,14);
assert.match(rebels24.episodeReviews[1].notes.join(' '),/S4E13.*s4e14/s);
assert.equal(db.prepare("SELECT COUNT(*) n FROM episode_reviews WHERE batch_id='SUPPLEMENT-24'").get().n,3);
assert.equal(db.prepare("SELECT COUNT(*) n FROM episode_links WHERE id LIKE 'SUPPLEMENT-24:%'").get().n,76);
assert.equal(db.prepare("SELECT COUNT(*) n FROM episodes e LEFT JOIN episode_reviews v ON v.episode_id=e.id WHERE e.record_id='series:rebels' AND v.episode_id IS NULL").get().n,0);
for(const r of supplement24.records.filter(r=>r.newRecord))assert.equal(r.facts.length,1);

// Supplement 25: on-screen scenes differ from reports, stored holos and design callbacks.
const supplement25=supplements.find(b=>b.id==='SUPPLEMENT-25');assert.ok(supplement25);
const batch25=supplement25.records.find(r=>r.id==='series:bad-batch');
assert.deepEqual(batch25.episodeReviews.map(r=>r.episodeId),[1,2,3,4,5].map(n=>`series:bad-batch:s1e${n}`));
assert.deepEqual(batch25.episodeReviews.map(r=>r.links.length),[22,15,17,8,20]);
for(const r of batch25.episodeReviews){assert.equal(r.consideredTargets.length,64);assert.equal(new Set(r.consideredTargets).size,64);}
for(const [ep,target] of [[1,'people:kanan-jarrus'],[1,'people:depa-billaba'],[1,'people:nala-se'],[1,'people:azi-3'],[1,'people:saw-gerrera'],[1,'planets:kaller'],[1,'planets:onderon'],[1,'planets:tipoca-city-training-facility'],[2,'people:cut-lawquane'],[2,'people:suu-lawquane'],[2,'people:shaeeah-lawquane'],[2,'people:jek-lawquane'],[2,'people:gonky'],[2,'species:nexu'],[2,'planets:19'],[3,'people:rampart'],[3,'people:elite-squad'],[3,'people:crosshair'],[3,'planets:ordo-moon'],[3,'species:ordo-moon-dragon'],[4,'people:fennec-shand'],[4,'planets:pantora'],[5,'people:cid'],[5,'people:muchi'],[5,'people:raney'],[5,'people:45'],[5,'species:brezak'],[5,'species:rancor'],[5,'species:zygerrian'],[5,'planets:cids-parlor'],[5,'planets:old-ord-mantell-city']])assert.equal(representation('series:bad-batch:s1e'+ep,target),'direct');
assert.equal(representation('series:bad-batch:s1e1','people:21'),'transmission');
assert.equal(representation('series:bad-batch:s1e5','people:fennec-shand'),'transmission');
assert.match(batch25.episodeReviews[4].links.find(l=>l.targetId==='people:fennec-shand').note,/Stored.*not a current live call/);
assert.match(batch25.episodeReviews[3].links.find(l=>l.targetId==='people:fennec-shand').note,/later physical/);
for(const [ep,target] of [[1,'people:10'],[1,'people:79'],[1,'people:captain-rex'],[1,'people:11'],[1,'planets:9'],[1,'planets:12'],[2,'people:captain-rex'],[2,'people:crosshair'],[2,'people:rampart'],[2,'planets:10'],[3,'people:saw-gerrera'],[3,'people:69'],[3,'planets:pantora'],[4,'people:nala-se'],[4,'people:72'],[4,'people:crosshair'],[5,'people:16'],[5,'people:crosshair']])assert.equal(representation('series:bad-batch:s1e'+ep,target),undefined,'A mention, reference, unidentified remote contact or unresolved scene is not a selected verified appearance');
assert.match(batch25.episodeReviews[1].notes.join(' '),/Rex visited yesterday/);
assert.match(batch25.episodeReviews[1].notes.join(' '),/separately registered 2023.*future precisely located/);
assert.match(batch25.episodeReviews[2].notes.join(' '),/Saw Gerrera.*explicitly absent/);
assert.match(batch25.episodeReviews[3].notes.join(' '),/Echo is an organic clone.*mistaken identification/);
assert.match(batch25.episodeReviews[4].notes.join(' '),/mistaken identification.*corrects it in caption 13/);
const fact25=(id,key)=>db.prepare('SELECT value FROM published_facts WHERE record_id=? AND key=?').get(id,key)?.value;
assert.equal(fact25('people:muchi','classification'),'Adolescent rancor');
assert.equal(fact25('planets:pantora','body_type'),'Moon orbiting Orto Plutonia');
assert.equal(fact25('species:ordo-moon-dragon','diet'),'Raw energy');
assert.equal(fact25('people:elite-squad','recruitment'),'Non-clone enlisted recruits for the Empire');
assert.match(fact25('species:zygerrian','historical_context'),/^Some groups/);
for(const r of supplement25.records.filter(r=>r.newRecord)){assert.equal(r.facts.length,1);assert.equal(r.credits.length,0);assert.equal(r.episodes.length,0);}
assert.equal(db.prepare("SELECT COUNT(*) n FROM facts WHERE record_id='people:muchi' AND key IN ('height','birth_year','identity')").get().n,0,'A young named rancor is not given an adult species dimension or another individual’s identity');
assert.equal(db.prepare("SELECT COUNT(*) n FROM links WHERE record_id='people:echo' AND target_id='species:2'").get().n,0,'A disguised organic clone is not a droid');
assert.equal(db.prepare("SELECT COUNT(*) n FROM episode_links WHERE id LIKE 'SUPPLEMENT-25:%'").get().n,82);
assert.equal(db.prepare("SELECT COUNT(*) n FROM episode_reviews WHERE batch_id='SUPPLEMENT-25'").get().n,5);
assert.equal(db.prepare("SELECT COUNT(*) n FROM episodes e LEFT JOIN episode_reviews r ON r.episode_id=e.id WHERE e.record_id='series:bad-batch' AND r.episode_id IS NULL").get().n,22);


// Supplement 26: named astromech, detached head, wreck and physical/mediated boundaries.
const supplement26=supplements.find(b=>b.id==='SUPPLEMENT-26');assert.ok(supplement26);
const batch26=supplement26.records.find(r=>r.id==='series:bad-batch');
assert.deepEqual(batch26.episodeReviews.map(r=>r.episodeId),[6,7,8,9,10].map(n=>`series:bad-batch:s1e${n}`));
assert.deepEqual(batch26.episodeReviews.map(r=>r.links.length),[19,15,16,18,15]);
for(const r of batch26.episodeReviews){assert.equal(r.consideredTargets.length,88);assert.equal(new Set(r.consideredTargets).size,88);}
for(const [ep,target] of [[6,'people:rafa-martez'],[6,'people:trace-martez'],[6,'people:r7-a7'],[6,'people:imperial-police-droid'],[6,'people:tactical-droid'],[6,'starships:silver-angel'],[6,'planets:22'],[6,'planets:droid-decommissioning-facility'],[7,'people:captain-rex'],[7,'people:bolo'],[7,'people:ketch'],[7,'species:dianoga'],[7,'starships:bracca-venator-wreck'],[8,'people:crosshair'],[8,'people:cad-bane'],[8,'people:todo-360'],[8,'starships:bracca-venator-wreck'],[9,'people:crosshair'],[9,'people:73'],[9,'people:nala-se'],[9,'people:fennec-shand'],[9,'starships:justifier'],[9,'vehicles:flight-pod'],[9,'planets:bora-vio'],[10,'people:gs-8'],[10,'people:avi-singh'],[10,'people:captain-bragg'],[10,'planets:raxus'],[10,'vehicles:53']])assert.equal(representation('series:bad-batch:s1e'+ep,target),'direct');
assert.equal(representation('series:bad-batch:s1e8','people:rampart'),'transmission');
for(const [ep,target] of [[6,'people:ahsoka-tano'],[6,'people:captain-rex'],[6,'people:super-tactical-droid'],[6,'planets:11'],[7,'people:rafa-martez'],[7,'people:trace-martez'],[7,'people:crosshair'],[7,'starships:63'],[8,'people:captain-rex'],[8,'people:cid'],[9,'people:69'],[9,'people:22'],[9,'planets:27'],[9,'planets:cids-parlor'],[10,'people:crosshair'],[10,'people:bolo'],[10,'people:ketch']])assert.equal(representation('series:bad-batch:s1e'+ep,target),undefined,'History, hints, design callbacks, unclassified hulls and unnamed patrons are not certified selected scene rows');
assert.match(batch26.episodeReviews[0].notes.join(' '),/transposes.*A7-R7/);
assert.match(batch26.episodeReviews[0].links.find(l=>l.targetId==='people:tactical-droid').note,/Detached head/);
assert.match(batch26.episodeReviews[1].notes.join(' '),/killed-in-action.*false/);
assert.match(batch26.episodeReviews[2].links.find(l=>l.targetId==='people:rampart').note,/not physical/);
assert.ok(batch26.episodeReviews[2].links.find(l=>l.targetId==='people:rampart').evidence.some(e=>e.locator.includes('released image 1')));
assert.match(batch26.episodeReviews[3].links.find(l=>l.targetId==='people:73').note,/Alive.*later motionless body/);
assert.match(batch26.episodeReviews[3].links.find(l=>l.targetId==='people:nala-se').note,/Physical meeting.*mediated call.*No physical Bora Vio/);
assert.ok(batch26.episodeReviews[3].links.find(l=>l.targetId==='people:crosshair').evidence.some(e=>e.sourceId==='supp26-bounty-lost-declassified'));
assert.match(batch26.episodeReviews[4].notes.join(' '),/Omega stays on Ord Mantell/);
assert.match(batch26.episodeReviews[4].notes.join(' '),/Raxus Prime.*name inspiration/);
assert.equal(fact25('people:r7-a7','function'),'Astromech and co-pilot aboard the Silver Angel');
assert.equal(fact25('starships:silver-angel','class'),'Modified Nebula-class freighter');
assert.equal(fact25('starships:bracca-venator-wreck','condition'),'Rusted and severely damaged cruiser wreck on Bracca');
assert.equal(fact25('vehicles:flight-pod','intended_use'),'Short-distance transport around the Bora Vio facility');
assert.equal(fact25('planets:bora-vio','system'),'Lido System');
assert.equal(db.prepare("SELECT COUNT(*) n FROM facts WHERE record_id='starships:bracca-venator-wreck' AND key IN ('length','crew','passengers')").get().n,0,'A wreck receives no copied ship-type specifications');
assert.equal(db.prepare("SELECT COUNT(*) n FROM records WHERE id='people:a7-r7'").get().n,0,'One naming conflict does not create a second astromech');
assert.equal(supplement26.records.filter(r=>r.newRecord).length,21);assert.equal(supplement26.sources.length,30);
for(const r of supplement26.records.filter(r=>r.newRecord)){assert.equal(r.facts.length,1);assert.equal(r.credits.length,0);assert.equal(r.episodes.length,0);}
assert.equal(db.prepare("SELECT COUNT(*) n FROM episode_links WHERE id LIKE 'SUPPLEMENT-26:%'").get().n,83);
assert.equal(db.prepare("SELECT COUNT(*) n FROM episode_reviews WHERE batch_id='SUPPLEMENT-26'").get().n,5);
assert.equal(db.prepare("SELECT COUNT(*) n FROM episodes e LEFT JOIN episode_reviews r ON r.episode_id=e.id WHERE e.record_id='series:bad-batch' AND r.episode_id IS NULL").get().n,22);


// Supplement 27: identity, troop roles, injury/survival and physical versus mediated scenes.
const supplement27=supplements.find(b=>b.id==='SUPPLEMENT-27');assert.ok(supplement27);
const batch27=supplement27.records.find(r=>r.id==='series:bad-batch');
assert.deepEqual(batch27.episodeReviews.map(r=>r.episodeId),[11,12,13,14,15].map(n=>`series:bad-batch:s1e${n}`));
assert.deepEqual(batch27.episodeReviews.map(r=>r.links.length),[15,21,14,18,18]);
for(const r of batch27.episodeReviews){assert.equal(r.consideredTargets.length,113);assert.equal(new Set(r.consideredTargets).size,113);}
assert.equal(representation('series:bad-batch:s1e14','people:captain-rex'),'transmission');
assert.equal(representation('series:bad-batch:s1e15','people:12'),'transmission');
for(const [ep,target] of [[11,'people:hera-syndulla'],[11,'people:chopper'],[11,'people:gobi-glie'],[11,'people:eleni-syndulla'],[11,'people:clone-captain-howzer'],[11,'people:orn-free-taa'],[11,'people:omega'],[12,'starships:rho-class-transport-shuttle'],[12,'starships:orn-free-taas-shuttle'],[13,'people:ruby'],[13,'people:pyke-syndicate'],[13,'species:irling'],[14,'people:gregor'],[14,'people:clone-commando'],[14,'people:tk-stormtrooper'],[14,'planets:daro'],[14,'planets:imperial-base-on-daro'],[15,'people:azi-3'],[15,'planets:tipoca-city'],[15,'planets:nala-ses-private-lab'],[15,'planets:kamino-tube-system']])assert.equal(representation('series:bad-batch:s1e'+ep,target),'direct');
for(const [ep,target] of [[11,'people:hunter'],[11,'people:cid'],[11,'starships:rho-class-transport-shuttle'],[12,'people:orn-free-taa'],[12,'people:21'],[13,'people:echo'],[14,'people:scorch'],[15,'people:nala-se'],[15,'people:imperial-sentry-droid'],[15,'starships:75'],[15,'starships:63'],[15,'people:tk-stormtrooper']])assert.equal(representation('series:bad-batch:s1e'+ep,target),undefined,'Selected unestablished identities are not inferred from group references, related cards, reports or design resemblance');
assert.ok(batch27.episodeReviews[3].links.find(l=>l.targetId==='people:captain-rex').evidence.some(e=>e.locator.includes('released still 2')));
assert.ok(batch27.episodeReviews[4].links.find(l=>l.targetId==='people:12').evidence.some(e=>e.locator.includes('released still 23')));
assert.match(batch27.episodeReviews[0].notes.join(' '),/like a niece.*biological/s);
assert.match(batch27.episodeReviews[0].links.find(l=>l.targetId==='people:orn-free-taa').note,/injured.*no death/i);
assert.match(batch27.episodeReviews[2].notes.join(' '),/Battle Scars.*targeted additive/s);
assert.match(batch27.episodeReviews[3].notes.join(' '),/CC-576.*CC-5576-39/s);
assert.match(batch27.episodeReviews[3].notes.join(' '),/designed to resemble Scorch.*alone does not certify/s);
assert.match(batch27.episodeReviews[3].notes.join(' '),/Omega and Wrecker remain with the Marauder/s);
assert.match(batch27.episodeReviews[4].notes.join(' '),/Crosshair claims.*not a dated/s);
assert.match(batch27.episodeReviews[4].notes.join(' '),/does not destroy Kamino/s);
assert.match(batch27.episodeReviews[4].notes.join(' '),/Senator-class Star Destroyer/s);
assert.equal(fact25('people:tk-stormtrooper','recruitment'),'Naturally born human recruits trained by clone commandos');
assert.equal(fact25('species:irling','activity'),'Nocturnal');
assert.equal(fact25('people:ruby','association'),'Companion of Roland Durand');
assert.equal(db.prepare("SELECT COUNT(*) n FROM records WHERE id IN ('people:scorch','people:young-hera-syndulla')").get().n,0,'Uncertain identity or younger age does not create a new person');
assert.equal(db.prepare("SELECT COUNT(*) n FROM facts WHERE record_id IN ('people:orn-free-taa','people:clone-captain-howzer','people:roland-durand') AND key IN ('death','death_date','died')").get().n,0,'Injury, arrest and horn loss do not establish death');
for(const id of ['planets:tipoca-city','planets:kamino-tube-system','planets:nala-ses-private-lab'])assert.equal(db.prepare('SELECT category FROM records WHERE id=?').get(id).category,'planets');
assert.equal(supplement27.records.filter(r=>r.newRecord).length,17);assert.equal(supplement27.sources.length,26);
for(const r of supplement27.records.filter(r=>r.newRecord)){assert.equal(r.facts.length,1);assert.equal(r.credits.length,0);assert.equal(r.episodes.length,0);}
assert.equal(db.prepare("SELECT COUNT(*) n FROM episode_links WHERE id LIKE 'SUPPLEMENT-27:%'").get().n,86);
assert.equal(db.prepare("SELECT COUNT(*) n FROM episode_reviews WHERE batch_id='SUPPLEMENT-27'").get().n,5);
assert.equal(db.prepare("SELECT COUNT(*) n FROM episodes e LEFT JOIN episode_reviews r ON r.episode_id=e.id WHERE e.record_id='series:bad-batch' AND r.episode_id IS NULL").get().n,22);


// Supplement 28: current identity evidence, place levels and actual versus mentioned scenes.
const supplement28=supplements.find(b=>b.id==='SUPPLEMENT-28');assert.ok(supplement28);
const batch28=supplement28.records.find(r=>r.id==='series:bad-batch');
assert.deepEqual(batch28.episodeReviews.map(r=>r.episodeId),['s1e16','s2e1','s2e2','s2e3','s2e4'].map(x=>'series:bad-batch:'+x));
assert.deepEqual(batch28.episodeReviews.map(r=>r.links.length),[19,16,13,13,16]);
for(const r of batch28.episodeReviews){assert.equal(r.consideredTargets.length,145);assert.equal(new Set(r.consideredTargets).size,145);assert.ok(r.links.every(l=>l.representation==='direct'));}
for(const [ep,target] of [['s1e16','species:kamoradon'],['s1e16','planets:wayland'],['s1e16','planets:mount-tantiss'],['s1e16','people:nala-se'],['s1e16','people:azi-3'],['s2e1','people:captain-wilco'],['s2e1','starships:imperial-cargo-ship'],['s2e2','starships:75'],['s2e2','vehicles:72'],['s2e2','people:rampart'],['s2e3','people:commander-cody'],['s2e3','people:b1-battle-droid'],['s2e3','people:droideka'],['s2e3','people:tactical-droid'],['s2e4','people:steel-claw-kane'],['s2e4','starships:star-commuter-shuttle'],['s2e4','planets:safa-toma'],['s2e4','planets:serolonis']])assert.equal(representation('series:bad-batch:'+ep,target),'direct');
for(const [ep,target] of [['s1e16','people:dr-emerie-karr'],['s1e16','people:dr-hemlock'],['s1e16','people:rampart'],['s2e1','starships:75'],['s2e1','people:67'],['s2e2','vehicles:35'],['s2e2','starships:imperial-cargo-ship'],['s2e3','people:captain-rex'],['s2e3','people:hunter'],['s2e3','people:omega'],['s2e3','people:tech'],['s2e3','people:echo'],['s2e3','people:wrecker'],['s2e4','people:hunter'],['s2e4','people:echo'],['s2e4','starships:marauder']])assert.equal(representation('series:bad-batch:'+ep,target),undefined);
assert.match(batch28.episodeReviews[0].notes.join(' '),/Older trivia 2 says its species was unknown/);
assert.match(batch28.episodeReviews[0].notes.join(' '),/Shutdown is not permanent destruction/);
assert.match(batch28.episodeReviews[1].notes.join(' '),/schematic.*does not count that diagram/s);
assert.match(batch28.episodeReviews[2].links.find(l=>l.targetId==='vehicles:72').note,/removed cannon.*not a restored whole tank/);
for(const id of ['people:b1-battle-droid','people:droideka'])assert.ok(batch28.episodeReviews[3].links.find(l=>l.targetId===id).evidence.some(e=>e.sourceId==='supp28-animation-interview'));
assert.match(batch28.episodeReviews[4].notes.join(' '),/city on Serolonis/);
assert.equal(fact25('planets:safa-toma','settlement_type'),'City on Serolonis');
assert.equal(fact25('vehicles:kamino-medical-capsule','medical_use'),'Cloning and medical containment');
assert.equal(supplement28.records.filter(r=>r.newRecord).length,22);assert.equal(supplement28.sources.length,27);
for(const r of supplement28.records.filter(r=>r.newRecord)){assert.equal(r.facts.length,1);assert.equal(r.credits.length,0);assert.equal(r.episodes.length,0);}
assert.equal(supplement28.sourceUpdates.length,1);assert.equal(supplement28.sourceUpdates[0].id,'supp25-nala-se');
assert.match(db.prepare("SELECT note FROM sources WHERE id='supp25-nala-se'").get().note,/Scope extension checked 4 November 2026/);
assert.equal(db.prepare("SELECT COUNT(*) n FROM records WHERE id IN ('people:nova','people:wyler','people:t-series-tactical-droid','people:b2-super-battle-droid','starships:class-four-container-transport')").get().n,0);
assert.equal(db.prepare("SELECT COUNT(*) n FROM episode_links WHERE id LIKE 'SUPPLEMENT-28:%'").get().n,77);
assert.equal(db.prepare("SELECT COUNT(*) n FROM episode_reviews WHERE batch_id='SUPPLEMENT-28'").get().n,5);
assert.equal(db.prepare("SELECT COUNT(*) n FROM episodes e LEFT JOIN episode_reviews r ON r.episode_id=e.id WHERE e.record_id='series:bad-batch' AND r.episode_id IS NULL").get().n,22);


// Supplement 29: memory/body identity, current scenes, ownership and archival evidence.
const supplement29=supplements.find(b=>b.id==='SUPPLEMENT-29');assert.ok(supplement29);
const batch29=supplement29.records.find(r=>r.id==='series:bad-batch');
assert.deepEqual(batch29.episodeReviews.map(r=>r.episodeId),[5,6,7,8,9].map(n=>'series:bad-batch:s2e'+n));
assert.deepEqual(batch29.episodeReviews.map(r=>r.links.length),[12,17,13,20,10]);
for(const r of batch29.episodeReviews){assert.equal(r.consideredTargets.length,172);assert.equal(new Set(r.consideredTargets).size,172);}
for(const [ep,target] of [[5,'people:hunter'],[5,'people:mel'],[5,'starships:marauder'],[6,'people:gungi'],[6,'people:yanna'],[6,'people:babwa-venomor'],[6,'people:vanguard-axis'],[6,'species:netcaster'],[6,'species:mylaya'],[7,'people:tynnra-pamlo'],[7,'people:coruscant-clone-assassin'],[7,'planets:martez-sisters-garage'],[8,'people:21'],[8,'people:59'],[8,'people:halle-burtoni'],[8,'people:coruscant-clone-assassin'],[8,'starships:ramparts-command-ship'],[8,'starships:75'],[9,'people:benni-baro'],[9,'species:ipsidon-buck']])assert.equal(representation('series:bad-batch:s2e'+ep,target),'direct');
assert.equal(representation('series:bad-batch:s2e7','people:59'),'unspecified','Selected combined caption does not independently establish medium of Amedda exchange');
assert.equal(representation('series:bad-batch:s2e8','planets:tipoca-city'),'transmission');assert.equal(representation('series:bad-batch:s2e9','people:cid'),'transmission');
for(const [ep,target] of [[5,'people:cid'],[5,'people:gonky'],[6,'people:12'],[6,'people:tk-stormtrooper'],[6,'vehicles:35'],[6,'vehicles:72'],[7,'people:hunter'],[7,'people:echo'],[7,'people:omega'],[7,'people:tech'],[7,'people:wrecker'],[7,'people:21'],[7,'people:rafa-martez'],[7,'people:trace-martez'],[7,'people:77'],[8,'people:slip'],[8,'starships:63'],[9,'people:echo'],[9,'people:crosshair'],[9,'people:roland-durand'],[9,'people:grini-millegi'],[9,'people:gonky'],[9,'planets:27']])assert.equal(representation('series:bad-batch:s2e'+ep,target),undefined,'References, ownership, unused concepts and later Related cards do not establish scenes');
assert.match(fact25('people:mel','identity_history'),/MEL-221.*MEL-222/);
assert.equal(db.prepare("SELECT COUNT(*) n FROM records WHERE id IN ('people:mel-222','people:clone-x-trooper','people:gani-riduli','vehicles:skara-nal-ancient-machine')").get().n,0);
assert.equal(fact25('people:vanguard-axis','organization_type'),'Droid cartel involved in smuggling');
assert.equal(fact25('people:coruscant-clone-assassin','identity_scope'),'Unidentified clone exposed when Rex removes the assassin’s helmet');
assert.match(batch29.episodeReviews[3].links.find(l=>l.targetId==='people:coruscant-clone-assassin').note,/remains.*not an alive/);
assert.match(batch29.episodeReviews[3].links.find(l=>l.targetId==='planets:tipoca-city').note,/Archival.*not present travel/);
assert.match(batch29.episodeReviews[4].links.find(l=>l.targetId==='people:cid').note,/Remote communication/);
assert.match(batch29.episodeReviews[1].notes.join(' '),/Wyyyschokk was an unused idea/);
assert.match(batch29.episodeReviews[4].notes.join(' '),/unused option does not verify.*species/s);
assert.equal(db.prepare("SELECT COUNT(*) n FROM facts WHERE record_id='starships:ramparts-command-ship' AND key IN ('length','model','crew','manufacturer')").get().n,0,'No type specifications transferred into operational ship instance');
for(const id of ['people:hunter','starships:marauder'])assert.ok(batch29.episodeReviews[0].links.find(l=>l.targetId===id).evidence.some(e=>/released still/.test(e.locator)));
assert.ok(batch29.episodeReviews[2].links.find(l=>l.targetId==='people:tynnra-pamlo').evidence.some(e=>/inspected released image 3/.test(e.locator)));
assert.equal(supplement29.records.filter(r=>r.newRecord).length,23);assert.equal(supplement29.sources.length,26);assert.equal(supplement29.sourceUpdates.length,0);
for(const r of supplement29.records.filter(r=>r.newRecord)){assert.equal(r.facts.length,1);assert.equal(r.credits.length,0);assert.equal(r.episodes.length,0);}
assert.equal(db.prepare("SELECT COUNT(*) n FROM episode_links WHERE id LIKE 'SUPPLEMENT-29:%'").get().n,72);
assert.equal(db.prepare("SELECT COUNT(*) n FROM episode_reviews WHERE batch_id='SUPPLEMENT-29'").get().n,5);
assert.equal(db.prepare("SELECT COUNT(*) n FROM episodes e LEFT JOIN episode_reviews r ON r.episode_id=e.id WHERE e.record_id='series:bad-batch' AND r.episode_id IS NULL").get().n,22);

console.log('Legacy profile review checks passed',JSON.stringify(checkProfileReviews(root,db)));
db.close();
console.log('Production catalogue checks passed',JSON.stringify(catalogue));
console.log('Archive integrity and provenance checks passed',JSON.stringify(summary));
