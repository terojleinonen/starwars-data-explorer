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
  // Profile 09: childhood versus birthplace, deleted material and separate pilot/gunner roles.
  const p09=batches.find(b=>b.id==='PROFILE-09');assert.ok(p09);
  assert.deepEqual(p09.records.map(r=>r.id),['people:9','people:18','people:19','people:27','people:31']);
  assert.equal(p09.records.reduce((n,r)=>n+r.factAssessments.length,0),30);
  assert.equal(p09.records.reduce((n,r)=>n+r.facts.filter(f=>f.expectedValue===null).length,0),16);
  assert.equal(p09.records.reduce((n,r)=>n+r.links.length,0),36);
  for(const [id,height] of [['people:9','183'],['people:18','170'],['people:19','180'],['people:27','180'],['people:31','160']])assert.equal(value(id,'height'),height);
  for(const id of p09.records.map(r=>r.id))for(const key of ['birth_year','mass','hair_color','skin_color','eye_color','gender'])assert.equal(value(id,key),'Not established');
  for(const [id,world] of [['people:9','planets:1'],['people:18','planets:22']]){assert.equal(relationship(id,world,'homeworld'),'legacy');assert.equal(relationship(id,world,'grew_up_on'),'verified');}
  assert.equal(relationship('people:19','planets:26','homeworld'),'legacy','An unnamed occupied homeworld does not identify Bestine IV');
  assert.match(value('people:9','deleted_material'),/deleted/);assert.equal(relationship('people:9','series:rebels','appears_in'),undefined,'Abandoned Biggs outline is not the released Wedge story');
  assert.equal(relationship('people:18','starships:10','gunner_aboard'),'verified');assert.equal(relationship('people:18','starships:10','pilots'),undefined);
  assert.ok(cites('people:18','link','people:18|starships:10|gunner_aboard').some(c=>c.locator.includes('caption 10')));
  assert.equal(relationship('people:27','planets:31','homeworld'),'verified');assert.equal(value('people:27','classification'),'Mon Calamari');assert.match(value('people:27','fate'),/Raddus bridge/);
  assert.equal(relationship('people:27','series:clone-wars-series','appears_in'),'verified');assert.equal(relationship('people:27','films:clone-wars-film','films'),undefined);
  assert.equal(relationship('people:27','starships:27','associated_with'),'verified');assert.equal(relationship('people:27','starships:27','pilots'),undefined);
  assert.equal(relationship('people:31','planets:33','homeworld'),'verified');assert.equal(value('people:31','classification'),'Sullustan');assert.match(value('people:31','fate'),/Tantive IV.*Exegol/);
  assert.equal(relationship('people:31','vehicles:resistance-ski-speeder','vehicles'),'verified');assert.equal(relationship('people:31','starships:12','starships'),undefined);assert.equal(relationship('people:31','starships:2','starships'),undefined);
  assert.equal(db.prepare("SELECT title,slug FROM records WHERE id='people:19'").get().title,'Jek Tono Porkins');
  assert.equal(value('people:19','birth_year','facts'),'unknown');assert.equal(value('people:27','hair_color','facts'),'none');
  // Profile 10: sourced environments, water percentages, orbital scenes and system/moon identity.
  const p10=batches.find(b=>b.id==='PROFILE-10');assert.ok(p10);
  assert.deepEqual(p10.records.map(r=>r.id),['planets:22','planets:31','planets:33','planets:36','planets:53']);
  assert.equal(p10.records.reduce((n,r)=>n+r.factAssessments.length,0),36);
  assert.equal(p10.records.reduce((n,r)=>n+r.facts.filter(f=>f.expectedValue===null).length,0),14);
  assert.equal(p10.records.reduce((n,r)=>n+r.links.length,0),24);
  for(const id of p10.records.map(r=>r.id))for(const key of ['rotation_period','orbital_period','diameter','gravity','surface_water','population'])assert.equal(value(id,key),'Not established','A local landscape, clan, system name or ocean does not establish a planet number');
  assert.equal(value('planets:31','climate'),'Temperate');assert.equal(value('planets:31','terrain'),'Oceans');assert.equal(value('planets:31','surface_water','facts'),'100');assert.match(value('planets:31','also_known_as'),/Mon Calamari.*Dac/);
  assert.equal(value('planets:33','terrain'),'Volcanic rock and lava flows — Battlefront depiction');assert.equal(value('planets:33','climate'),'Not established');assert.match(value('planets:33','appearance_scope'),/Named in Return of the Jedi.*orbital setting.*Battlefront/);
  assert.equal(relationship('planets:33','films:3','mentioned_in'),'verified');assert.equal(relationship('planets:33','films:3','films'),undefined,'A spoken world name is not a visible planet scene');assert.equal(relationship('planets:33','films:force-awakens','films'),undefined,'Abandoned Episode VII exploration is not a released scene');
  assert.equal(relationship('planets:33','series:clone-wars-series','appears_in'),'verified');assert.ok(cites('planets:33','link','planets:33|series:clone-wars-series|appears_in').some(c=>c.locator.includes('Caption 1')&&c.note.includes('Orbital')));
  assert.equal(value('planets:36','terrain'),'Forests, mountains, swamps');assert.equal(value('planets:36','surface_water','facts'),'unknown');assert.equal(value('planets:36','population','facts'),'5200');assert.match(value('planets:36','identity_scope'),/Distinct from Peridea/);
  assert.equal(relationship('planets:36','planets:peridea','associated_with'),'verified');assert.equal(relationship('planets:36','planets:peridea','identity'),undefined);assert.equal(relationship('planets:36','series:rebels','appears_in'),'verified');assert.equal(relationship('planets:36','series:ahsoka','appears_in'),'verified');assert.equal(relationship('planets:36','planets:maul-dathomir-sanctuary','contains'),'verified');
  assert.ok(cites('planets:36','link','planets:36|series:ahsoka|appears_in').some(c=>c.locator.includes('Highlight 7')));assert.equal(relationship('planets:36','people:asajj-ventress','birthplace_of'),'verified');assert.equal(value('people:asajj-ventress','height','facts'),undefined,'A place relationship does not review the linked person');
  assert.match(value('planets:53','identity_scope'),/system.*planet-specific.*unresolved/);assert.match(value('planets:53','notable_location'),/third moon/);assert.equal(value('planets:53','rotation_period','facts'),'unknown');assert.equal(value('planets:53','terrain'),'Not established');assert.equal(relationship('planets:53','planets:protectors-camp','associated_with'),'verified');assert.equal(relationship('planets:53','planets:protectors-camp','contains'),undefined,'A system-level association must not put the camp on the inherited planet');assert.equal(relationship('planets:53','people:69','residents'),'legacy','The selected system/camp sources do not identify Jango residence');
  for(const [id,person] of [['planets:22','people:14'],['planets:22','people:18'],['planets:31','people:27'],['planets:36','people:44']])assert.equal(relationship(id,person,'residents'),'verified');assert.equal(relationship('planets:33','people:31','residents'),'legacy');assert.equal(relationship('planets:33','people:31','homeworld_of'),'verified');
  for(const id of ['planets:22','planets:33','planets:36','planets:53'])assert.equal(value(id,'climate'),'Not established');assert.equal(value('planets:22','terrain'),'Not established');assert.match(value('planets:22','notable_feature'),/construction and dismantling/);
  for(const id of p10.records.map(r=>r.id))assert.equal(db.prepare('SELECT category FROM records WHERE id=?').get(id).category,'planets','Inherited routes/categories remain stable despite system ambiguity');
  // Profile 11: individual dimensions, descriptive morphology and culture are not species averages.
  const p11=batches.find(b=>b.id==='PROFILE-11');assert.ok(p11);
  assert.deepEqual(p11.records.map(r=>r.id),['species:28','species:8','species:10','species:22','species:15']);
  assert.equal(p11.records.reduce((n,r)=>n+r.factAssessments.length,0),31);
  assert.equal(p11.records.reduce((n,r)=>n+r.facts.filter(f=>f.expectedValue!==null).length,0),9);
  assert.equal(p11.records.reduce((n,r)=>n+r.facts.filter(f=>f.expectedValue===null).length,0),14);
  assert.equal(p11.records.reduce((n,r)=>n+r.links.length,0),38);
  for(const r of p11.records){assert.equal(value(r.id,'average_height'),'Not established');assert.equal(value(r.id,'average_lifespan'),'Not established');assert.equal(value(r.id,'eye_colors'),'Not established');assert.equal(value(r.id,'hair_colors'),'Not established');}
  for(const [id,raw] of [['species:28','178'],['species:8','160'],['species:10','180'],['species:22','180'],['species:15','200']])assert.equal(value(id,'average_height','facts'),raw,'Population means must not be replaced with individual dimensions');
  assert.equal(value('species:28','classification'),'Insectoid');assert.equal(value('species:28','designation'),'Sentient');assert.equal(value('species:28','language'),'Geonosian');assert.doesNotMatch(value('species:28','language'),/telepath/i);
  assert.equal(value('species:8','classification'),'Amphibious humanoid');assert.match(value('species:8','habitat_adaptation'),/underwater.*above/);assert.match(value('species:8','age_related_changes'),/age/);assert.equal(value('species:8','skin_colors'),'Not established');
  assert.equal(value('species:10','classification'),'Humanoid');assert.equal(value('species:10','language'),'Not established');assert.equal(value('species:10','language','facts'),'Sullutese','Do not silently correct an unsupported old language spelling');
  for(const id of ['species:8','species:10','species:22'])assert.equal(value(id,'designation'),'Not established');
  assert.equal(value('species:22','classification'),'Not established');assert.equal(value('species:22','skin_colors'),'Not established');assert.match(value('species:22','identity_scope'),/Eeth Koth: Iridonian Zabrak.*Maul: Zabrak from Dathomir/);assert.match(value('species:22','cultural_group'),/Nightbrothers.*community/);
  assert.equal(relationship('species:22','planets:45','homeworld'),'legacy','An Iridonian individual does not verify the homeworld of all Zabrak');assert.equal(relationship('species:22','planets:36','associated_with'),'verified');assert.equal(relationship('species:22','planets:36','homeworld'),undefined);
  assert.equal(value('species:15','classification'),'Humanoid');assert.equal(value('species:15','designation'),'Sentient');assert.equal(value('species:15','language'),'Twi’leki');assert.equal(value('species:15','language','facts'),'Twi’leki');assert.match(value('species:15','skin_colors'),/no exhaustive palette/);assert.match(value('species:15','cultural_tradition'),/^Many families/);
  assert.ok(cites('species:15','fact','language').some(c=>c.source_id==='profile11-ryloth'));assert.equal(relationship('species:15','series:mandalorian','appears_in'),'verified');assert.ok(cites('species:15','link','species:15|series:mandalorian|appears_in').some(c=>c.locator.includes('Xi’an')));
  assert.equal(relationship('species:15','people:46','people'),'verified');assert.equal(db.prepare("SELECT title FROM records WHERE id='people:46'").get().title,'Ayla Secura','A membership review must preserve the old linked identity');
  for(const [id,world] of [['species:28','planets:11'],['species:8','planets:31'],['species:10','planets:33'],['species:15','planets:37']])assert.equal(relationship(id,world,'homeworld'),'verified');
  for(const id of p11.records.map(r=>r.id))assert.equal(relationship(id,'films:clone-wars-film','films'),undefined,'A TV-series appearance label does not certify the 2008 feature');
  assert.equal(relationship('species:28','films:rogue-one','films'),undefined,'Death Star design and a novel discussion are not a living species scene in Rogue One');
  assert.equal(relationship('planets:33','films:force-awakens','films'),undefined,'A Sullustan species appearance must not become a Sullust world scene');
  assert.equal(relationship('species:22','series:maul-shadow-lord','appears_in'),'verified');assert.equal(relationship('species:22','films:solo','films'),'verified');assert.ok(cites('species:22','link','species:22|films:solo|films').some(c=>c.note.includes('hologram')));
  // Profile 12: personal facts, deleted scenes, portrayal-specific colours and homeworld scope.
  const p12=batches.find(b=>b.id==='PROFILE-12');assert.ok(p12);
  assert.deepEqual(p12.records.map(r=>r.id),['people:28','people:45','people:46','people:54','people:63']);
  assert.equal(p12.records.reduce((n,r)=>n+r.factAssessments.length,0),27);
  assert.equal(p12.records.reduce((n,r)=>n+r.facts.filter(f=>f.expectedValue!==null).length,0),8);
  assert.equal(p12.records.reduce((n,r)=>n+r.facts.filter(f=>f.expectedValue===null).length,0),16);
  assert.equal(p12.records.reduce((n,r)=>n+r.links.length,0),43);
  for(const [id,height] of [['people:28','150'],['people:45','180'],['people:46','170'],['people:54','187'],['people:63','175']])assert.equal(value(id,'height'),height,'Official nominal metres must be converted to archive centimetres');
  for(const r of p12.records)for(const key of ['mass','birth_year','gender'])assert.equal(value(r.id,key),'Not established');
  assert.equal(value('people:28','eye_color'),'Blue — Rebels portrayal');assert.equal(value('people:28','hair_color'),'Red — Rebels portrayal');
  assert.match(value('people:28','deleted_material'),/Revenge of the Sith.*cut/);assert.notEqual(relationship('people:28','films:6','films'),'verified','A deleted scene is not a released-film appearance');
  assert.equal(relationship('people:28','planets:32','homeworld'),'verified');assert.equal(relationship('people:28','planets:25','operated_above'),'verified');assert.notEqual(relationship('people:28','planets:25','visited'),'verified','Orbital broadcasting does not establish a surface visit');
  assert.match(value('people:45','spoken_language'),/Huttese; understands other/);assert.match(value('people:45','fate'),/Boba Fett and Fennec Shand/);
  assert.ok(cites('people:45','link','people:45|series:mandalorian|appears_in').some(c=>c.source_id==='profile12-fortuna-post-credits'),'Own-profile work-list omission needs separate post-credits evidence');
  assert.equal(value('people:46','skin_color'),'Blue');assert.equal(value('people:46','official_name'),'Aayla Secura');assert.equal(db.prepare("SELECT title FROM records WHERE id='people:46'").get().title,'Ayla Secura');
  assert.equal(relationship('people:46','films:4','films'),'legacy');assert.equal(relationship('people:54','films:6','films'),'legacy','Omitted list items are not automatically verified or removed');
  assert.equal(value('people:54','classification'),'Iridonian Zabrak');assert.equal(relationship('people:54','planets:45','homeworld'),'verified');assert.equal(relationship('species:22','planets:45','homeworld'),'legacy');
  for(const [id,world] of [['people:45','planets:37'],['people:46','planets:37'],['people:63','planets:11']])assert.equal(relationship(id,world,'homeworld'),'legacy','A Locations list or workplace alone does not establish personal origin');
  assert.equal(relationship('people:63','people:4','killed_by'),'verified');assert.equal(relationship('people:63','people:67','allies'),'verified');assert.equal(db.prepare("SELECT title FROM records WHERE id='people:67'").get().title,'Dooku');
  assert.equal(relationship('people:63','films:rogue-one','films'),undefined);assert.equal(value('species:28','average_height'),'Not established');
  for(const r of p12.records)assert.notEqual(relationship(r.id,'films:clone-wars-film','films'),'verified','The television series does not establish a feature-film scene');
  // Profile 13: vehicle height/length, speed quantities, crew and model boundaries.
  const p13=batches.find(b=>b.id==='PROFILE-13');assert.ok(p13);
  assert.deepEqual(p13.records.map(r=>r.id),['vehicles:18','vehicles:19','vehicles:14','vehicles:30','vehicles:4']);
  assert.equal(p13.records.reduce((n,r)=>n+r.factAssessments.length,0),35);
  assert.equal(p13.records.reduce((n,r)=>n+r.facts.filter(f=>f.expectedValue!==null).length,0),15);
  assert.equal(p13.records.reduce((n,r)=>n+r.facts.filter(f=>f.expectedValue===null).length,0),16);
  assert.equal(p13.records.reduce((n,r)=>n+r.links.length,0),32);
  for(const [id,height,oldLength] of [['vehicles:18','22.5 m','20'],['vehicles:19','9.04 m','2']]){
    assert.equal(value(id,'height'),height,'Explicit metre units avoid the character-height centimetre formatter');
    assert.equal(value(id,'length'),'Not established');assert.equal(value(id,'length','facts'),oldLength,'A nominal height cannot overwrite a length');
  }
  assert.match(value('vehicles:18','passengers'),/Up to 40.*depending on internal configuration/);
  assert.equal(value('vehicles:19','ground_speed'),'Up to 90 km/h on flat ground');
  assert.equal(value('vehicles:19','max_atmosphering_speed'),'Not established');assert.equal(value('vehicles:19','max_atmosphering_speed','facts'),'90','Supported ground speed is not an atmospheric-speed value');
  for(const id of ['vehicles:19','vehicles:14'])assert.equal(value(id,'crew'),'2');
  assert.equal(value('vehicles:19','passengers'),'Not established');assert.equal(value('vehicles:19','passengers','facts'),'0','Three actual commandeering occupants do not revise nominal crew or establish passenger capacity');
  assert.equal(value('vehicles:14','length'),'5.3 m');assert.equal(value('vehicles:4','length'),'40 m');assert.equal(value('vehicles:4','vehicle_class'),'Tracked transport');
  assert.equal(value('vehicles:30','model'),'74-Z speeder bike');assert.equal(value('vehicles:30','manufacturer'),'Aratech');
  for(const [key,raw] of [['length','3'],['crew','1'],['passengers','1']]){assert.equal(value('vehicles:30',key),'Not established');assert.equal(value('vehicles:30',key,'facts'),raw,'A mixed-model dimension or shared ride does not establish 74-Z nominal limits');}
  assert.match(value('vehicles:30','riding_context'),/share.*before Luke seizes another/);
  assert.ok(cites('vehicles:14','link','vehicles:14|people:1|pilots').some(c=>c.source_id==='profile03-luke-gallery'&&/17/.test(c.locator)));
  assert.ok(cites('vehicles:19','link','vehicles:19|people:13|pilots').some(c=>c.source_id==='profile03-chewbacca'&&/two Ewoks/.test(c.locator)&&/not regular Imperial crew/.test(c.note)));
  for(const target of ['vehicles:76','vehicles:at-dp'])assert.equal(relationship('vehicles:19',target,'design_lineage'),'verified');
  assert.equal(relationship('vehicles:18','planets:jakku','wreck_on'),'verified');assert.equal(relationship('vehicles:18','planets:jakku','operated_on'),undefined);
  assert.ok(cites('vehicles:18','link','vehicles:18|films:force-awakens|films').some(c=>/wreck/i.test(c.note)));
  for(const target of ['series:rebels','series:mandalorian','series:clone-wars-series'])assert.equal(relationship('vehicles:30',target,'appears_in'),undefined,'Mixed-model work lists are not automatically 74-Z appearances');
  assert.equal(relationship('vehicles:30','films:6','films'),undefined,'The official Stass Allie 74-Z/BARC conflict is not silently resolved');
  assert.ok(cites('vehicles:4','link','vehicles:4|series:mandalorian|appears_in').some(c=>c.source_id==='supp08-the-mandalorian-chapter-2-official-story-gallery'));
  for(const id of p13.records.map(r=>r.id))assert.equal(db.prepare('SELECT category FROM records WHERE id=?').get(id).category,'vehicles');
  return {profiles,verified,unestablished};
}
