import { DatabaseSync } from 'node:sqlite';
import { readFileSync, mkdirSync, rmSync, writeFileSync, renameSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { applyReviews } from './apply-reviews.mjs';
import { applyReviewPlan } from './apply-review-plan.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(readFileSync(join(root, 'data/legacy/manifest.json'), 'utf8'));
const editorial = JSON.parse(readFileSync(join(root, 'data/editorial.json'), 'utf8'));
mkdirSync(join(root, 'data'), { recursive: true });
const targetPath = join(root, 'data/archive.sqlite');
const path = join(root, 'data/archive.build.sqlite');
rmSync(path, { force: true });
const db = new DatabaseSync(path);
db.exec(`PRAGMA foreign_keys=ON;
  CREATE TABLE records(id TEXT PRIMARY KEY,category TEXT NOT NULL,legacy_id TEXT,slug TEXT NOT NULL,title TEXT NOT NULL,summary TEXT NOT NULL,year INTEGER,era TEXT NOT NULL,continuity TEXT NOT NULL,review_status TEXT NOT NULL,UNIQUE(category,slug));
  CREATE TABLE sources(id TEXT PRIMARY KEY,title TEXT NOT NULL,url TEXT NOT NULL,kind TEXT NOT NULL,checked_at TEXT NOT NULL,note TEXT NOT NULL);
  CREATE TABLE facts(record_id TEXT NOT NULL REFERENCES records(id),key TEXT NOT NULL,value TEXT NOT NULL,source_id TEXT NOT NULL REFERENCES sources(id),review_status TEXT NOT NULL,PRIMARY KEY(record_id,key));
  CREATE TABLE record_sources(record_id TEXT NOT NULL REFERENCES records(id),source_id TEXT NOT NULL REFERENCES sources(id),PRIMARY KEY(record_id,source_id));
  CREATE TABLE links(record_id TEXT NOT NULL REFERENCES records(id),target_id TEXT NOT NULL REFERENCES records(id),relation TEXT NOT NULL,source_id TEXT NOT NULL REFERENCES sources(id),review_status TEXT NOT NULL,PRIMARY KEY(record_id,target_id,relation));
  CREATE INDEX records_category ON records(category);
  CREATE INDEX records_legacy ON records(category,legacy_id);
  CREATE INDEX links_target ON links(target_id);
  CREATE TABLE metadata(key TEXT PRIMARY KEY,value TEXT NOT NULL);
`);
const record = db.prepare('INSERT INTO records VALUES(?,?,?,?,?,?,?,?,?,?)');
const source = db.prepare('INSERT OR IGNORE INTO sources VALUES(?,?,?,?,?,?)');
const fact = db.prepare('INSERT INTO facts VALUES(?,?,?,?,?)');
const reference = db.prepare('INSERT OR IGNORE INTO record_sources VALUES(?,?)');
const link = db.prepare('INSERT OR IGNORE INTO links VALUES(?,?,?,?,?)');
const slugify = text => text.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const rawByCategory = {};
const ids = new Set();
db.exec('BEGIN');
for (const collection of manifest.collections) {
  const category = collection.category;
  const sourceId = `legacy-${category}`;
  source.run(sourceId, `Original ${category} collection`, collection.fetchedFrom, 'legacy', manifest.capturedAt, 'One-time copy of the old website. Upstream: swapi.info. Individual fact references and data reuse terms have not been established. Narrative opening crawls were excluded.');
  const raws = JSON.parse(readFileSync(join(root, `data/legacy/${category}.json`), 'utf8'));
  rawByCategory[category] = raws;
  for (const raw of raws) {
    const legacyId = raw.url.match(/\/(\d+)\/?$/)?.[1];
    if (!legacyId) throw new Error(`Invalid legacy identity in ${category}`);
    const id = `${category}:${legacyId}`;
    const title = raw.name ?? raw.title;
    const isFilm = category === 'films';
    record.run(id, category, legacyId, slugify(title), title, '', isFilm ? Number(raw.release_date.slice(0,4)) : null, isFilm ? 'Lucas' : 'Not classified', isFilm ? 'Canon' : 'Not assessed', 'legacy');
    ids.add(id);
    reference.run(id, sourceId);
    for (const [key, value] of Object.entries(raw)) {
      if (['url','created','edited','name','title','opening_crawl'].includes(key) || Array.isArray(value) || String(value).includes('/api/')) continue;
      fact.run(id, key, String(value), sourceId, 'legacy');
    }
    if (isFilm) {
      fact.run(id,'collection',Number(raw.episode_id) <= 3 ? 'Prequel trilogy' : 'Original trilogy',sourceId,'legacy');
      fact.run(id,'format','Live-action film',sourceId,'legacy');
    }
  }
}
const skipped = [];
for (const [category, raws] of Object.entries(rawByCategory)) {
  for (const raw of raws) {
    const id = `${category}:${raw.url.match(/\/(\d+)\/?$/)[1]}`;
    for (const [relation, value] of Object.entries(raw)) {
      if (relation === 'url') continue;
      const targets = Array.isArray(value) ? value : [value];
      for (const target of targets) {
        if (typeof target !== 'string') continue;
        const match = target.match(/\/api\/(\w+)\/(\d+)\/?$/);
        if (!match) continue;
        const targetId = `${match[1]}:${match[2]}`;
        if (ids.has(targetId)) link.run(id,targetId,relation,`legacy-${category}`,'legacy');
        else skipped.push({id,relation,targetId});
      }
    }
  }
}
for (const entry of editorial) {
  const id = `${entry.category}:${entry.id}`;
  const sourceId = `official-${entry.id}`;
  source.run(sourceId,`${entry.title} — official reference`,entry.source,'official','2026-10-25','Public official reference used for manually entered title, release year and introductory metadata. The summary is original editorial text. This is not a licence to copy the source’s images or prose.');
  record.run(id,entry.category,null,slugify(entry.title),entry.title,entry.summary,entry.year,entry.era,entry.continuity,'editorial');
  ids.add(id);
  reference.run(id,sourceId);
  for (const [key,value] of Object.entries(entry.facts)) fact.run(id,key,String(value),sourceId,'reference');
}
for (const [from,to,sourceId] of [['series:andor','films:rogue-one','official-andor'],['films:mandalorian-grogu','series:mandalorian','official-mandalorian-grogu'],['series:clone-wars-series','films:clone-wars-film','official-clone-wars-film'],['series:obi-wan','people:10','official-obi-wan'],['series:ahsoka','people:11','official-ahsoka']]) {
  link.run(from,to,'story_connection',sourceId,'reference');
  reference.run(from,sourceId); reference.run(to,sourceId);
}
source.run('continuity-2014','Lucasfilm’s continuity announcement','https://www.starwars.com/news/the-legendary-star-wars-expanded-universe-turns-a-new-page','official','2026-10-25','Supports the original six films as the foundation of current canon. It does not verify every imported character or technical attribute.');
for (const raw of rawByCategory.films) reference.run(`films:${raw.url.match(/\/(\d+)\/?$/)[1]}`,'continuity-2014');
source.run('vader-identity','Darth Vader — official Databank','https://www.starwars.com/databank/darth-vader','official','2026-10-25','Supports Anakin Skywalker and Darth Vader as the same person. The two legacy profiles are retained, not counted as independently verified unique people.');
link.run('people:4','people:11','identity','vader-identity','reference');
reference.run('people:4','vader-identity'); reference.run('people:11','vader-identity');
// Scope plans belong at a declared historical boundary, before later factual reviews.
const reviewPlan = JSON.parse(readFileSync(join(root,'data/reviews/review-plan-01.json'),'utf8'));
let planning;
const reviews = applyReviews(db,root,{afterSupplement:batch=>{
  if(batch.id===reviewPlan.afterSupplementId)planning=applyReviewPlan(db,root);
}});
if(!planning)throw new Error('The declared research-plan boundary was not applied');
const metadata = db.prepare('INSERT INTO metadata VALUES(?,?)');
metadata.run('imported_at',manifest.capturedAt);
metadata.run('legacy_records',String(manifest.collections.reduce((sum,c)=>sum+c.count,0)));
metadata.run('editorial_records',String(db.prepare("SELECT COUNT(*) AS n FROM records WHERE review_status='editorial'").get().n));
metadata.run('reviewed_productions',String(reviews.primaryRecords));
metadata.run('skipped_links',String(skipped.length));
db.exec('COMMIT; VACUUM;');
const report = { reviews, planning, records:db.prepare('SELECT COUNT(*) AS count FROM records').get().count, facts:db.prepare('SELECT COUNT(*) AS count FROM facts').get().count, links:db.prepare('SELECT COUNT(*) AS count FROM links').get().count, categories:db.prepare('SELECT category,COUNT(*) AS count FROM records GROUP BY category').all(), skippedLinks:skipped, integrity:db.prepare('PRAGMA integrity_check').get(), foreignKeyProblems:db.prepare('PRAGMA foreign_key_check').all() };
writeFileSync(join(root,'data/import-report.json'),JSON.stringify(report,null,2)+'\n');
db.close();
renameSync(path,targetPath);
console.log(JSON.stringify(report));
