import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../data/legacy/', import.meta.url));
const categories = ['people', 'planets', 'starships', 'vehicles', 'species', 'films'];
await mkdir(root, { recursive: true });
const manifest = { capturedAt: new Date().toISOString(), origin: 'https://starwars-data-explorer.vercel.app', status: 'Legacy import; individual fact sources and reuse terms not established', excludedFields: ['opening_crawl'], collections: [] };
const results = await Promise.allSettled(categories.map(async category => {
  const url = `https://starwars-data-explorer.vercel.app/api/swapi/${category}`;
  const response = await fetch(url, { signal: AbortSignal.timeout(45000) });
  if (!response.ok) throw new Error(`${category}: HTTP ${response.status}`);
  const raw = await response.text();
  const json = JSON.parse(raw);
  const records = Array.isArray(json) ? json : json.results;
  if (!Array.isArray(records) || !records.length) throw new Error(`${category}: no records`);
  const sanitized = records.map(record => Object.fromEntries(Object.entries(record).filter(([key]) => key !== 'opening_crawl')));
  await writeFile(`${root}${category}.json`, JSON.stringify(sanitized, null, 2) + '\n');
  const entry = { category, count: records.length, fetchedFrom: url, capturedResponseSha256: createHash('sha256').update(raw).digest('hex') };
  console.log(JSON.stringify(entry));
  return entry;
}));
for (const result of results) {
  if (result.status === 'fulfilled') manifest.collections.push(result.value);
  else console.error(result.reason.message);
}
await writeFile(`${root}manifest.json`, JSON.stringify(manifest, null, 2) + '\n');
if (manifest.collections.length !== categories.length) process.exitCode = 1;
