import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';

export function checkProfileReviews(root,db){
  const batches=readdirSync(join(root,'data/reviews')).filter(n=>/^profile-\d+\.json$/.test(n)).sort().map(n=>JSON.parse(readFileSync(join(root,'data/reviews',n),'utf8')));
  let profiles=0,verified=0,unestablished=0;
  const cites=(id,type,key)=>db.prepare('SELECT source_id,locator,note FROM citations WHERE record_id=? AND subject_type=? AND subject_key=? ORDER BY id').all(id,type,key).map(c=>({...c}));
  const expected=items=>items.map(e=>({source_id:e.sourceId,locator:e.locator,note:e.note??''}));
  for(const batch of batches){
    for(const s of batch.sources){assert.equal(new URL(s.url).protocol,'https:');assert.ok(s.reuseBasis&&s.attribution);assert.ok(db.prepare('SELECT 1 FROM citations WHERE source_id=?').get(s.id),'Every profile source must support a stated use');}
    for(const update of batch.sourceUpdates??[])assert.equal(db.prepare('SELECT note FROM sources WHERE id=?').get(update.id)?.note,update.note);
    for(const r of batch.records){
      profiles++;
      const record=db.prepare('SELECT * FROM records WHERE id=?').get(r.id);
      assert.equal(record.legacy_id,r.id.split(':')[1]);assert.equal(record.review_status,'legacy','Origin and review status must remain separate');assert.equal(record.summary,r.summary.text);
      for(const k of ['era','continuity']){assert.equal(record[k],r.metadata[k]);assert.deepEqual(cites(r.id,'record_metadata',k),expected(r.metadata.evidence));}
      const review=db.prepare('SELECT * FROM record_reviews WHERE record_id=?').get(r.id);assert.equal(review.is_primary,0);assert.equal(review.scope,r.scope);assert.equal(review.checked_at,batch.checkedAt);assert.deepEqual(JSON.parse(review.limitations),r.limitations);
      assert.deepEqual(cites(r.id,'summary','summary'),expected(r.summary.evidence));
      for(const f of r.facts){verified++;assert.deepEqual({...db.prepare('SELECT value,review_status FROM facts WHERE record_id=? AND key=?').get(r.id,f.key)},{value:f.value,review_status:'verified'});assert.deepEqual(cites(r.id,'fact',f.key),expected(f.evidence));}
      for(const f of r.factAssessments){
        unestablished++;
        const raw=db.prepare('SELECT value,source_id,review_status FROM facts WHERE record_id=? AND key=?').get(r.id,f.key);
        assert.deepEqual({...raw},{value:f.expectedValue,source_id:f.expectedSourceId,review_status:'unestablished'},'Withheld source values must remain recoverable');
        assert.deepEqual({...db.prepare('SELECT status,note,checked_at FROM fact_assessments WHERE record_id=? AND key=?').get(r.id,f.key)},{status:f.status,note:f.note,checked_at:batch.checkedAt});
        assert.equal(db.prepare('SELECT value FROM published_facts WHERE record_id=? AND key=?').get(r.id,f.key).value,'Not established','The reader must not receive an unsubstantiated number as the current value');
        assert.deepEqual(cites(r.id,'fact_assessment',f.key),expected(f.evidence));
      }
      for(const l of r.links){assert.equal(db.prepare('SELECT review_status FROM links WHERE record_id=? AND target_id=? AND relation=?').get(r.id,l.targetId,l.relation)?.review_status,'verified');assert.deepEqual(cites(r.id,'link',`${r.id}|${l.targetId}|${l.relation}`),expected(l.evidence));}
    }
  }
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM facts f LEFT JOIN fact_assessments a ON a.record_id=f.record_id AND a.key=f.key WHERE f.review_status='unestablished' AND a.key IS NULL").get().n,0);
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM fact_assessments').get().n,unestablished);
  const value=(id,key,table='published_facts')=>db.prepare(`SELECT value FROM ${table} WHERE record_id=? AND key=?`).get(id,key)?.value;
  assert.equal(value('people:8','height'),'97','0.97 m is 97 cm in the archive unit');
  assert.equal(value('starships:12','length'),'13.4 m');assert.equal(value('starships:12','hyperdrive_rating'),'Not established','Having a hyperdrive does not establish its numerical rating');
  assert.match(value('starships:12','model'),/T-65/);assert.doesNotMatch(value('starships:12','model'),/T-70/);
  assert.match(value('planets:9','population'),/Trillions/);assert.notEqual(value('planets:9','population'),'1000000000000');
  assert.equal(value('planets:8','surface_water'),'Not established');assert.equal(value('planets:9','surface_water','facts'),'unknown','Unknown must not become zero');
  assert.match(value('planets:9','first_film_appearance'),/1997 Special Edition/);
  assert.equal(db.prepare("SELECT review_status FROM links WHERE record_id='planets:8' AND target_id='films:3' AND relation='films'").get().review_status,'legacy','A modern appearance list does not identify a historical cut');
  assert.equal(db.prepare("SELECT review_status FROM links WHERE record_id='people:8' AND target_id='planets:1' AND relation='homeworld'").get().review_status,'legacy','A location is not a manufacturing homeworld');
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM records WHERE review_status='editorial'").get().n,Number(db.prepare("SELECT value FROM metadata WHERE key='editorial_records'").get().value),'Reviewing legacy profiles must not inflate the imported-new-record count');
  // Profile 02: published official dimensions, time-scoped casing and identity boundaries.
  const p02=batches.find(b=>b.id==='PROFILE-02');assert.ok(p02);
  assert.deepEqual(p02.records.map(r=>r.id),['people:10','people:64','people:2','people:3','people:68']);
  assert.equal(p02.records.reduce((n,r)=>n+r.factAssessments.length,0),29);
  for(const [id,height] of [['people:10','182'],['people:64','176'],['people:2','177'],['people:3','109'],['people:68','199']])assert.equal(value(id,'height'),height,'Metres must be converted to archive centimetres');
  assert.equal(value('people:64','skin_color'),'Green');
  assert.equal(value('people:2','classification'),'Protocol droid');assert.equal(value('people:3','classification'),'Astromech droid');
  for(const id of ['people:2','people:3']){assert.equal(value(id,'skin_color'),'Not established');assert.equal(value(id,'gender'),'Not established');assert.equal(value(id,'birth_year'),'Not established');assert.ok(value(id,'exterior_colour'));}
  assert.match(value('people:2','exterior_colour'),/Varies by era/);assert.match(value('people:3','exterior_colour'),/The Phantom Menace/);
  assert.match(value('people:68','family_connection'),/adoptive/);assert.equal(value('people:68','mass','facts'),'unknown');
  for(const [id,world] of [['people:10','planets:20'],['people:64','planets:51'],['people:2','planets:1'],['people:3','planets:8'],['people:68','planets:2']])assert.equal(db.prepare('SELECT review_status FROM links WHERE record_id=? AND target_id=? AND relation=?').get(id,world,'homeworld').review_status,'legacy','A location, construction account or Senate representation must not silently verify a homeworld');
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_links WHERE episode_id='series:mandalorian:s2e8' AND target_id='people:3'").get().n,0,'A series-level appearance list does not resolve a previously unestablished finale scene');
  // Profile 03: conflicting dimensions, experience versus age and scoped scene evidence.
  const p03=batches.find(b=>b.id==='PROFILE-03');assert.ok(p03);
  assert.deepEqual(p03.records.map(r=>r.id),['people:25','people:20','people:21','people:14','people:13']);
  assert.equal(p03.records.reduce((n,r)=>n+r.factAssessments.length,0),30);
  for(const [id,height] of [['people:25','178'],['people:20','66'],['people:14','180'],['people:13','228']])assert.equal(value(id,'height'),height);
  assert.equal(value('people:21','height'),'Not established');assert.equal(value('people:21','height','facts'),'170');
  const conflict=db.prepare("SELECT note FROM fact_assessments WHERE record_id='people:21' AND key='height'").get().note;
  assert.match(conflict,/1\.73 m/);assert.match(conflict,/1\.78 m/);assert.match(conflict,/without assigning/);
  assert.equal(value('people:20','skin_color'),'Green');assert.equal(value('people:20','teaching_experience'),'More than 800 years');
  for(const id of p03.records.map(r=>r.id))assert.equal(value(id,'birth_year'),'Not established','A scene age or teaching duration must not produce an exact birth year');
  const relationship=(id,target,relation)=>db.prepare('SELECT review_status FROM links WHERE record_id=? AND target_id=? AND relation=?').get(id,target,relation)?.review_status;
  assert.equal(relationship('people:25','planets:30','homeworld'),'legacy','Bespin administration does not establish Socorro birth');
  assert.equal(relationship('people:14','planets:22','homeworld'),'legacy');assert.equal(relationship('people:14','planets:22','grew_up_on'),'verified');
  assert.equal(relationship('people:20','planets:5','resided_on'),'verified');
  assert.equal(relationship('people:13','planets:14','homeworld'),'verified','Chewbacca has explicit individual homeworld evidence');
  assert.equal(value('people:13','classification'),'Wookiee');assert.equal(value('people:13','skin_color','facts'),'unknown');
  const yodaScene=cites('people:20','link','people:20|films:last-jedi|films');
  assert.deepEqual(yodaScene.map(c=>c.source_id),['profile03-last-jedi-yoda','profile03-luke-gallery']);assert.match(yodaScene[1].locator,/Caption 43/);
  const hanScene=cites('people:14','link','people:14|films:rise-skywalker|films');
  assert.ok(hanScene.some(c=>c.source_id==='profile03-kylo-vision'&&c.locator.includes('vision of Han')),'A work-level list alone does not identify the form of Han’s later appearance');
  assert.equal(db.prepare("SELECT representation FROM episode_links WHERE target_id='people:20' AND representation='force_communication'").get()?.representation,'force_communication','Living remote guidance is distinct from a later spirit scene');
  const landoSource=db.prepare("SELECT url,checked_at,note FROM sources WHERE id='supp12-lando-databank'").get();
  assert.equal(landoSource.url,'https://www.starwars.com/databank/lando-calrissian/');assert.equal(landoSource.checked_at,'2026-10-28');assert.match(landoSource.note,/PROFILE-03/);
  // Profile 04: one person across life stages; birth and upbringing are different assertions.
  const p04=batches.find(b=>b.id==='PROFILE-04');assert.ok(p04);
  assert.deepEqual(p04.records.map(r=>r.id),['people:1','people:5','people:11','people:4','people:12']);
  for(const [id,height] of [['people:1','172'],['people:5','150'],['people:11','188'],['people:4','203'],['people:12','185']])assert.equal(value(id,'height'),height,'Use the source profile’s nominal dimension, in centimetres');
  for(const id of p04.records.map(r=>r.id)){assert.equal(value(id,'birth_year'),'Not established');assert.equal(value(id,'mass'),'Not established');}
  assert.equal(value('people:4','hair_color','facts'),'none');assert.equal(value('people:4','hair_color'),'Not established');assert.equal(value('people:12','mass','facts'),'unknown','Unestablished placeholders must not become zero');
  assert.match(value('people:11','known_as'),/Darth Vader.*same person/);assert.match(value('people:4','known_as'),/Anakin Skywalker.*same person/);
  const identity=db.prepare("SELECT review_status,source_id FROM links WHERE record_id='people:4' AND target_id='people:11' AND relation='identity'").get();assert.equal(identity.review_status,'reference');assert.equal(identity.source_id,'vader-identity','Keep the prior identity reference and both numeric dossier IDs');
  for(const [id,home] of [['people:1','planets:1'],['people:5','planets:2']]){
    assert.equal(value(id,'birthplace'),'Polis Massa');assert.equal(relationship(id,home,'homeworld'),'legacy');assert.equal(relationship(id,home,'grew_up_on'),'verified');assert.equal(relationship(id,'planets:15','born_on'),'verified','The explicitly named twin birthplace is separate from upbringing');
    assert.ok(cites(id,'link',`${id}|planets:15|born_on`).some(c=>c.source_id==='profile04-polis-massa'));
  }
  assert.equal(value('people:12','birthplace'),'Eriadu');assert.equal(relationship('people:12','planets:21','homeworld'),'verified');
  assert.equal(relationship('people:11','planets:1','homeworld'),'legacy','Childhood slavery does not establish birth there');
  assert.equal(relationship('people:4','planets:13','resided_on'),'verified','The Imperial castle is a residence context, not a birthplace');
  assert.equal(value('people:11','jedi_rank'),'Jedi Knight during the Clone Wars');assert.equal(value('people:11','apprentice'),'Ahsoka Tano');
  assert.match(value('people:5','family_connection'),/adopted daughter/);assert.equal(relationship('people:5','people:68','adopted_by'),'verified');
  assert.ok(cites('people:1','link','people:1|films:last-jedi|films').some(c=>c.locator.includes('Force projection')),'A Crait projection is not physical travel from Ahch-To');
  assert.ok(cites('people:5','link','people:5|films:rise-skywalker|films').some(c=>c.source_id==='profile04-rise-ending'),'An omitted Databank work needs separate scene evidence');
  assert.ok(cites('people:11','link','people:11|series:rebels|appears_in').some(c=>c.locator.includes('temple vision')));
  assert.ok(cites('people:11','link','people:11|films:3|films').some(c=>c.note.includes('Edition-specific')),'A work link does not unify original and replacement actor imagery');
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM episode_links WHERE episode_id='series:rebels:s1e1' AND target_id='people:4'").get().n,0);
  assert.equal(db.prepare("SELECT url FROM sources WHERE id='profile04-tarkin'").get().url,'https://www.starwars.com/databank/grand-moff-tarkin');
  // Profile 05: nominal dimensions, personal homeworlds and time-scoped teaching/roles.
  const p05=batches.find(b=>b.id==='PROFILE-05');assert.ok(p05);
  assert.deepEqual(p05.records.map(r=>r.id),['people:35','people:32','people:51','people:67','people:44']);
  assert.equal(p05.records.reduce((n,r)=>n+r.factAssessments.length,0),30);
  assert.equal(p05.records.reduce((n,r)=>n+r.links.length,0),45);
  for(const [id,height] of [['people:35','165'],['people:32','193'],['people:51','192'],['people:67','193'],['people:44','184']])assert.equal(value(id,'height'),height,'Use the current official nominal character dimension in centimetres');
  for(const id of p05.records.map(r=>r.id)){assert.equal(value(id,'birth_year'),'Not established');assert.equal(value(id,'mass'),'Not established');assert.equal(value(id,'gender'),'Not established');}
  assert.equal(value('people:44','hair_color','facts'),'none');assert.equal(value('people:44','hair_color'),'Not established');
  assert.equal(relationship('people:32','planets:28','homeworld'),'legacy');assert.equal(relationship('people:51','planets:42','homeworld'),'legacy');
  assert.equal(relationship('people:35','planets:8','homeworld'),'verified');assert.ok(cites('people:35','link','people:35|planets:8|homeworld').some(c=>c.source_id==='profile05-clones-story'&&c.locator.includes('35')));
  assert.equal(relationship('people:67','planets:52','homeworld'),'verified');assert.equal(relationship('people:44','planets:36','homeworld'),'verified');
  for(const id of ['people:35','people:67','people:44'])assert.equal(value(id,'birthplace'),undefined,'An explicit homeworld is not automatically an exact birthplace');
  assert.equal(relationship('people:67','species:1','species'),'legacy','No Human field inferred from portrayal or missing profile metadata');
  assert.equal(relationship('people:44','species:22','species'),'verified');assert.equal(value('people:44','classification'),'Dathomirian Zabrak');assert.equal(relationship('people:44','planets:45','homeworld'),undefined,'A general species homeworld is not a personal birthplace');
  assert.match(value('people:67','known_as'),/Darth Tyranus.*same person/);assert.equal(db.prepare("SELECT COUNT(*) AS n FROM records WHERE lower(title)='darth tyranus'").get().n,0);
  assert.equal(db.prepare("SELECT title FROM records WHERE id='people:44'").get().title,'Darth Maul');assert.equal(db.prepare("SELECT url FROM sources WHERE id='profile05-maul'").get().url,'https://www.starwars.com/databank/maul');
  assert.match(p05.records.find(r=>r.id==='people:44').facts.find(f=>f.key==='height').evidence[0].note,/does not assign/);assert.match(value('people:44','body_modifications'),/Successive sets/);
  assert.equal(value('people:32','jedi_rank'),'Jedi Master');assert.equal(value('people:51','jedi_rank'),'Jedi Master');assert.equal(value('people:51','weapon'),'Amethyst-bladed lightsaber');
  assert.equal(relationship('people:32','people:67','trained_by'),'verified');assert.equal(relationship('people:67','people:32','trained'),'verified');assert.equal(relationship('people:67','people:20','trained_by'),'verified');assert.equal(relationship('people:44','people:21','trained_by'),'verified');
  for(const id of ['people:35','people:51','people:67'])assert.equal(relationship(id,'films:clone-wars-film','films'),'verified','The film has its own named role or synopsis evidence');
  assert.ok(cites('people:51','link','people:51|films:6|films').some(c=>c.locator.includes('Revenge of the Sith history')),'A missing work-list item needs named story evidence');
  for(const [id,target,relation] of [['people:35','starships:49','starships'],['people:35','starships:64','starships'],['people:32','vehicles:38','vehicles'],['people:44','starships:41','starships']])assert.equal(relationship(id,target,relation),'legacy','Similar names, generic designs and selected biographies do not silently verify an inherited craft identity');
  for(const id of ['people:32','people:51'])assert.equal(relationship(id,'films:rise-skywalker','films'),undefined,'Unreviewed voice-cameo evidence is not guessed from general franchise knowledge');
  // Profile 06: whole worlds, settlements and deleted scenes have different scopes.
  const p06=batches.find(b=>b.id==='PROFILE-06');assert.ok(p06);
  assert.deepEqual(p06.records.map(r=>r.id),['planets:2','planets:4','planets:5','planets:6','planets:7']);
  assert.equal(p06.records.reduce((n,r)=>n+r.factAssessments.length,0),33);
  assert.equal(p06.records.reduce((n,r)=>n+r.links.length,0),19);
  for(const id of p06.records.map(r=>r.id))for(const key of ['diameter','gravity','orbital_period','rotation_period','population','surface_water'])assert.equal(value(id,key),'Not established','A scenic description cannot establish exact world measurements');
  assert.equal(value('planets:4','climate'),'Cold');assert.equal(value('planets:5','climate'),'Humid');
  assert.equal(value('planets:4','surface_water','facts'),'100');assert.equal(value('planets:6','surface_water','facts'),'0');assert.equal(value('planets:5','gravity','facts'),'N/A');
  assert.equal(value('planets:6','classification'),'Gas giant');assert.equal(value('planets:6','terrain'),'Gaseous');assert.match(value('planets:6','notable_location'),/Cloud City.*atmospheric band/);
  assert.equal(value('planets:7','classification'),'Forest moon');assert.ok(cites('planets:7','fact','classification').some(c=>c.source_id==='profile06-kef-bir'));
  assert.equal(relationship('planets:5','films:6','films'),'legacy','Deleted Dagobah material is not a released-film appearance');assert.match(value('planets:5','appearance_scope'),/deleted scene/);
  assert.equal(relationship('planets:6','films:3','films'),undefined,'A current work list does not resolve the original versus later edition boundary');
  assert.equal(relationship('planets:6','people:26','residents'),'legacy');assert.equal(relationship('planets:6','people:26','associated_with'),'verified','City employment does not silently verify residence');
  assert.equal(relationship('planets:2','people:81','residents'),'legacy');assert.equal(relationship('planets:2','people:5','residents'),'verified');
  assert.equal(value('people:30','height','facts'),'88','An identity match does not review the linked person’s old facts');assert.equal(relationship('planets:7','people:30','residents'),'verified');
  // Profile 07: dimensions, staffing scope, variants and station identity.
  const p07=batches.find(b=>b.id==='PROFILE-07');assert.ok(p07);
  assert.deepEqual(p07.records.map(r=>r.id),['starships:10','starships:3','starships:9','starships:22','starships:15']);
  assert.equal(p07.records.reduce((n,r)=>n+r.factAssessments.length,0),46);assert.equal(p07.records.reduce((n,r)=>n+r.links.length,0),39);
  assert.equal(value('starships:10','length'),'34.75 m');assert.equal(value('starships:10','model'),'YT-1300 light freighter');assert.equal(value('starships:10','manufacturer'),'Corellian Engineering Corporation');
  assert.equal(value('starships:10','crew'),'Not established');assert.equal(value('starships:10','max_atmosphering_speed'),'Not established');assert.equal(value('starships:10','hyperdrive_rating'),'Not established');
  assert.ok(cites('starships:10','fact','manufacturer').some(c=>c.source_id==='profile07-falcon-manufacturer'&&c.note.includes('lifestyle')));
  assert.equal(value('starships:3','length'),'1600 m');assert.equal(value('starships:3','model'),'Not established');assert.match(value('starships:3','identity_scope'),/no individual hull or I\/II subtype/);
  assert.equal(value('starships:9','model'),'DS-1 Orbital Battle Station');assert.equal(value('starships:9','hyperdrive_rating'),'4');assert.equal(value('starships:9','length'),'Not established');assert.equal(value('starships:9','length','facts'),'120000');assert.equal(value('starships:9','equatorial_diameter'),'160 km');
  assert.match(value('starships:9','crew'),/depending on mission/);assert.match(value('starships:9','crew'),/includes garrisons/);assert.equal(value('starships:9','passengers'),'Not established');
  assert.ok(cites('starships:9','fact','identity_scope').some(c=>c.source_id==='profile07-death-star-ii'));
  for(const target of ['films:3','films:rise-skywalker'])assert.equal(relationship('starships:9',target,'films'),undefined,'Second-station appearances do not belong to DS-1');
  assert.equal(value('starships:22','model'),'Lambda-class shuttle');assert.equal(value('starships:22','manufacturer'),'Not established');assert.equal(value('starships:22','hyperdrive_rating'),'Not established');assert.match(value('starships:22','propulsion'),/numerical rating not established/);
  assert.equal(relationship('starships:22','films:2','films'),'legacy','A modern work list does not establish an original-versus-later cut boundary');
  for(const target of ['people:1','people:13','people:14'])assert.equal(relationship('starships:22',target,'pilots'),'legacy','A passenger association is not a pilot credit');
  for(const target of ['people:4','people:21'])assert.equal(relationship('starships:22',target,'used_by'),'verified');
  assert.equal(value('starships:15','length'),'19000 m');assert.equal(value('starships:15','model'),'Not established');assert.equal(value('starships:15','starship_class'),'Super Star Destroyer');assert.equal(relationship('starships:15','starships:9','collided_with'),undefined);assert.equal(relationship('starships:15','planets:7','destroyed_near'),'verified');
  for(const id of p07.records.map(r=>r.id))for(const key of ['cost_in_credits','passengers','cargo_capacity','consumables','MGLT'])assert.equal(value(id,key),'Not established');
  // Profile 08: source nominal dimensions, named hulls and configuration boundaries.
  const p08=batches.find(b=>b.id==='PROFILE-08');assert.ok(p08);
  assert.deepEqual(p08.records.map(r=>r.id),['starships:11','starships:28','starships:13','starships:21','starships:40']);
  assert.equal(p08.records.reduce((n,r)=>n+r.factAssessments.length,0),49);
  assert.equal(p08.records.reduce((n,r)=>n+r.facts.filter(f=>f.expectedValue!==null).length,0),11);
  assert.equal(p08.records.reduce((n,r)=>n+r.links.length,0),35);
  for(const [id,length] of [['starships:11','23.4 m'],['starships:28','6.9 m'],['starships:13','5.8 m'],['starships:40','76 m']])assert.equal(value(id,'length'),length);
  assert.equal(value('starships:21','length'),'Not established');assert.equal(value('starships:21','length','facts'),'21.5');
  assert.equal(value('starships:11','model'),'Not established');assert.equal(value('starships:28','model'),'Not established');
  assert.match(value('starships:11','identity_scope'),/BTA.*later version/);
  assert.match(value('starships:28','identity_scope'),/trainer.*Resistance/);
  assert.equal(value('starships:11','max_atmosphering_speed','facts'),'1000km');
  assert.match(db.prepare("SELECT note FROM fact_assessments WHERE record_id='starships:11' AND key='max_atmosphering_speed'").get().note,/without a time denominator/);
  for(const id of p08.records.map(r=>r.id))for(const key of ['manufacturer','cost_in_credits','max_atmosphering_speed','crew','passengers','cargo_capacity','consumables','hyperdrive_rating','MGLT'])assert.equal(value(id,key),'Not established','A named pilot, spare component, qualitative speed or another variant does not certify an inherited number');
  assert.equal(value('starships:13','model'),'TIE Advanced x1');assert.ok(cites('starships:13','fact','model').some(c=>c.source_id==='profile08-tie-model-label'&&c.note.includes('lifestyle')));
  assert.ok(cites('starships:13','fact','identity_scope').some(c=>c.source_id==='supp12-inquisitor-s-tie-advanced-prototype-databank'));
  assert.equal(value('starships:21','model'),'Modified Firespray-31-class patrol and attack craft');assert.match(value('starships:21','known_as'),/Slave I.*same vessel/);
  assert.equal(db.prepare("SELECT title,slug FROM records WHERE id='starships:21'").get().title,'Slave 1');
  assert.equal(db.prepare("SELECT slug FROM records WHERE id='starships:21'").get().slug,'slave-1');
  assert.equal(value('starships:40','model'),'J-type 327 Nubian royal starship');assert.equal(value('starships:40','armament'),'No offensive weaponry');assert.match(value('starships:40','propulsion'),/numerical class not established/);assert.match(value('starships:40','replacement_component'),/T-14/);
  assert.equal(relationship('starships:28','people:29','pilots'),'legacy','An unnamed A-wing bridge strike does not verify Arvel by name');
  for(const person of ['people:ezra-bridger','people:kanan-jarrus'])assert.equal(relationship('starships:28',person,'pilots'),undefined,'A trainer source must not create generic fighter pilot rows');
  for(const [id,target,rel] of [['starships:11','films:mandalorian-grogu','films'],['starships:11','series:andor','appears_in'],['starships:11','people:3','pilots'],['starships:11','people:2','transported'],['starships:28','films:last-jedi','films'],['starships:28','starships:15','attacked'],['starships:13','people:4','pilots'],['starships:13','starships:9','operated_near'],['starships:21','people:69','pilots'],['starships:21','people:hondo-ohnaka','repaired_by'],['starships:21','people:14','transported'],['starships:40','people:39','pilots'],['starships:40','people:35','used_by']])assert.equal(relationship(id,target,rel),'verified');
  assert.equal(relationship('starships:11','films:rise-skywalker','films'),undefined,'A BTA work-list entry does not certify earlier BTL specifications');
  assert.equal(relationship('starships:40','people:35','pilots'),undefined,'Royal carriage is not piloting');
  assert.equal(relationship('starships:28','starships:9','attacked'),undefined,'Executor’s destruction involved the second station, not DS-1');
  return {profiles,verified,unestablished};
}
