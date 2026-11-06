import { DatabaseSync } from "node:sqlite";
import { join } from "node:path";
import type { ArchiveEpisode, EpisodeCredit, EpisodeConnection, ArchiveCredit, FilmEdition, FilmRelease, EditionTimelineEvent, ArchiveRecord, ArchiveSource, ArchiveStats, Category, Citation, Evidence, RecordFact, RecordReview, RelatedRecord } from "./types";

let connection: DatabaseSync | undefined;
function database() { return connection ??= new DatabaseSync(join(process.cwd(), "data", "archive.sqlite"), { readOnly: true }); }
type Row = { id: string; category: Category; legacy_id: string | null; slug: string; title: string; summary: string; year: number | null; era: string; continuity: string; review_status: "legacy" | "editorial" };
function convert(row: Row): ArchiveRecord {
  const facts = database().prepare("SELECT key,value FROM published_facts WHERE record_id=? AND review_status<>'unestablished' ORDER BY key").all(row.id) as { key: string; value: string }[];
  const count = database().prepare("SELECT COUNT(DISTINCT CASE WHEN record_id=? THEN target_id ELSE record_id END) AS count FROM links WHERE record_id=? OR target_id=?").get(row.id, row.id, row.id) as { count: number };
  const review = database().prepare("SELECT checked_at FROM record_reviews WHERE record_id=?").get(row.id) as { checked_at: string } | undefined;
  return { id: row.id, category: row.category, legacyId: row.legacy_id, slug: row.slug, title: row.title, summary: row.summary, year: row.year, era: row.era, continuity: row.continuity, reviewStatus: row.review_status, reviewedAt: review?.checked_at ?? null, facts: Object.fromEntries(facts.map(fact => [fact.key, fact.value])), connectionCount: count.count };
}
export function getRecords(category?: Category): ArchiveRecord[] {
  const rows = category ? database().prepare("SELECT * FROM records WHERE category=? ORDER BY COALESCE(year,9999),title").all(category) : database().prepare("SELECT * FROM records ORDER BY title").all();
  return (rows as Row[]).map(convert);
}
export function getRecord(category: Category, slugOrId: string): ArchiveRecord | null {
  const row = database().prepare("SELECT * FROM records WHERE category=? AND (slug=? OR legacy_id=?)").get(category,slugOrId,slugOrId) as Row | undefined;
  return row ? convert(row) : null;
}
export function getCitations(id: string): Citation[] {
  return (database().prepare("SELECT source_id,subject_type,subject_key,locator,note,checked_at FROM citations WHERE record_id=? ORDER BY id").all(id) as { source_id: string; subject_type: string; subject_key: string; locator: string; note: string; checked_at: string }[]).map(row=>({ sourceId: row.source_id, subjectType: row.subject_type, subjectKey: row.subject_key, locator: row.locator, note: row.note, checkedAt: row.checked_at }));
}
export function getFacts(id: string): RecordFact[] {
  const citations=getCitations(id);
  return (database().prepare("SELECT key,value,source_id,review_status,assessment_note FROM published_facts WHERE record_id=? ORDER BY key").all(id) as { key: string; value: string; source_id: string; review_status: string; assessment_note: string }[]).map(row => ({ key: row.key, value: row.value, sourceId: row.source_id, reviewStatus: row.review_status, assessmentNote: row.assessment_note, evidence: citations.filter(c=>c.subjectType===(row.review_status==="unestablished"?"fact_assessment":"fact")&&c.subjectKey===row.key) }));
}
export function getSources(recordId?: string): ArchiveSource[] {
  const rows = recordId ? database().prepare("SELECT s.* FROM sources s JOIN record_sources r ON r.source_id=s.id WHERE r.record_id=? ORDER BY s.kind,s.title").all(recordId) : database().prepare("SELECT * FROM sources ORDER BY kind,title").all();
  return (rows as {id:string;title:string;url:string;kind:ArchiveSource["kind"];checked_at:string;note:string;license:string;reuse_basis:string;attribution:string;revision:string}[]).map(row => ({id:row.id,title:row.title,url:row.url,kind:row.kind,checkedAt:row.checked_at,note:row.note,license:row.license,reuseBasis:row.reuse_basis,attribution:row.attribution,revision:row.revision}));
}
export function getRelated(id: string): RelatedRecord[] {
  const rows=database().prepare(`SELECT r.id,r.category,r.slug,r.title,l.record_id,l.target_id,l.relation,l.source_id,l.review_status FROM links l JOIN records r ON r.id=CASE WHEN l.record_id=? THEN l.target_id ELSE l.record_id END WHERE l.record_id=? OR l.target_id=? ORDER BY r.category,r.title`).all(id,id,id) as {id:string;category:Category;slug:string;title:string;record_id:string;target_id:string;relation:string;source_id:string;review_status:string}[];
  const grouped=new Map<string,RelatedRecord>();
  const evidenceCache=new Map<string,Citation[]>();
  const rank=(status:string)=>status==="verified"?2:status==="reference"?1:0;
  for(const row of rows){
    const existing=grouped.get(row.id);
    if(existing&&rank(existing.reviewStatus)>=rank(row.review_status))continue;
    const key=`${row.record_id}|${row.target_id}|${row.relation}`;
    if(!evidenceCache.has(row.record_id))evidenceCache.set(row.record_id,getCitations(row.record_id));
    const evidence:Evidence[]=evidenceCache.get(row.record_id)!.filter(c=>c.subjectType==="link"&&c.subjectKey===key);
    if(!evidence.length)evidence.push({sourceId:row.source_id,locator:"",note:"",checkedAt:""});
    grouped.set(row.id,{id:row.id,category:row.category,slug:row.slug,title:row.title,relation:row.relation,reviewStatus:row.review_status,evidence});
  }
  return [...grouped.values()];
}
export function getCredits(id: string): ArchiveCredit[] {
  const citations=getCitations(id);
  return (database().prepare("SELECT c.*,p.name,r.slug AS character_slug,e.label AS edition_label FROM credits c JOIN contributors p ON p.id=c.contributor_id LEFT JOIN records r ON r.id=c.character_record_id LEFT JOIN film_editions e ON e.id=c.edition_id WHERE c.record_id=? ORDER BY c.position").all(id) as {id:string;name:string;role:string;character_name:string;character_record_id:string|null;character_slug:string|null;scope:string;note:string;edition_id:string|null;edition_label:string|null}[]).map(row=>({id:row.id,person:row.name,role:row.role,characterName:row.character_name,characterRecordId:row.character_record_id,characterSlug:row.character_slug,scope:row.scope,note:row.note,editionId:row.edition_id,editionLabel:row.edition_label,evidence:citations.filter(c=>c.subjectType==="credit"&&c.subjectKey===row.id)}));
}
export function getReview(id: string): RecordReview | null {
  const row=database().prepare("SELECT * FROM record_reviews WHERE record_id=?").get(id) as {batch_id:string;checked_at:string;scope:string;limitations:string;is_primary:number}|undefined;
  if(!row)return null;
  const issues=database().prepare("SELECT field,status,note FROM review_issues WHERE record_id=? ORDER BY id").all(id) as {field:string;status:string;note:string}[];
  const supplements=database().prepare("SELECT s.scope FROM review_supplements s JOIN review_batches b ON b.id=s.batch_id WHERE s.record_id=? ORDER BY b.checked_at,b.id").all(id) as {scope:string}[];
  return {batchId:row.batch_id,checkedAt:row.checked_at,scope:[row.scope,...supplements.map(s=>s.scope)].join(" "),limitations:JSON.parse(row.limitations),isPrimary:!!row.is_primary,issues};
}
export function getStats(): ArchiveStats {
  const values = Object.fromEntries((database().prepare("SELECT key,value FROM metadata").all() as {key:string;value:string}[]).map(row=>[row.key,row.value]));
  const counts = Object.fromEntries((database().prepare("SELECT category,COUNT(*) AS count FROM records GROUP BY category").all() as {category:Category;count:number}[]).map(row=>[row.category,row.count])) as Record<Category,number>;
  return {total:Object.values(counts).reduce((a,b)=>a+b,0),legacy:Number(values.legacy_records),editorial:Number(values.editorial_records),connections:(database().prepare("SELECT COUNT(*) AS count FROM links").get() as {count:number}).count,counts,importedAt:values.imported_at,reviewedProductions:Number(values.reviewed_productions??0)};
}

type ReleaseRow = { id: string; date: string; date_end: string | null; territory: string; medium: FilmRelease["medium"]; event_type: string; status: FilmRelease["status"]; label: string; note: string };
function releaseFromRow(row: ReleaseRow, citations: Citation[]): FilmRelease {
  return {id:row.id,date:row.date,dateEnd:row.date_end,territory:row.territory,medium:row.medium,eventType:row.event_type,status:row.status,label:row.label,note:row.note,evidence:citations.filter(c=>c.subjectType==="release"&&c.subjectKey===row.id)};
}
export function getUnassignedFilmReleases(recordId: string): FilmRelease[] {
  const citations = getCitations(recordId);
  return (database().prepare('SELECT * FROM release_events WHERE record_id=? AND edition_id IS NULL ORDER BY date,id').all(recordId) as ReleaseRow[]).map(row=>releaseFromRow(row,citations));
}
export function getFilmEditions(recordId:string):FilmEdition[]{
  const citations=getCitations(recordId),originalCredits=getCredits(recordId);
  const rows=database().prepare("SELECT * FROM film_editions WHERE record_id=? ORDER BY year,CASE kind WHEN 'original' THEN 0 ELSE 1 END,id").all(recordId) as {id:string;record_id:string;label:string;year:number;kind:"original"|"revision";summary:string;scope_note:string}[];
  return rows.map(row=>{
    const releases=(database().prepare('SELECT * FROM release_events WHERE edition_id=? ORDER BY date,id').all(row.id) as ReleaseRow[]).map(r=>releaseFromRow(r,citations));
    const extra=(database().prepare('SELECT c.*,p.name FROM edition_credits c JOIN contributors p ON p.id=c.contributor_id WHERE c.edition_id=? ORDER BY c.position').all(row.id) as {id:string;name:string;role:string}[]).map(c=>({id:c.id,person:c.name,role:c.role,characterName:"",characterRecordId:null,characterSlug:null,scope:row.label,note:"",editionId:row.id,editionLabel:row.label,evidence:citations.filter(e=>e.subjectType==="edition_credit"&&e.subjectKey===c.id)}));
    return {id:row.id,label:row.label,year:row.year,kind:row.kind,summary:row.summary,scopeNote:row.scope_note,evidence:citations.filter(c=>c.subjectType==="edition"&&c.subjectKey===row.id),releases,credits:[...originalCredits.filter(c=>c.editionId===row.id),...extra.filter(c=>!originalCredits.some(o=>o.editionId===row.id&&o.person===c.person&&o.role===c.role))]};
  });
}
export function getEditionTimelineEvents():EditionTimelineEvent[]{
  return (database().prepare("SELECT e.id AS edition_id,CASE WHEN e.kind='revision' THEN e.label ELSE x.label END AS label,r.category,r.slug,r.title,x.id,x.date,x.date_end,x.territory,x.medium FROM release_events x LEFT JOIN film_editions e ON e.id=x.edition_id JOIN records r ON r.id=x.record_id WHERE x.status='released' AND ((r.category='films' AND (e.kind='revision' OR x.edition_id IS NULL)) OR (r.category='series' AND NOT (x.date=COALESCE((SELECT value FROM facts WHERE record_id=r.id AND key='release_date'),'') AND x.event_type IN ('series_premiere','television_premiere','platform_launch')))) ORDER BY x.date,x.id").all() as {category:"films"|"series";edition_id:string|null;label:string;slug:string;title:string;id:string;date:string;date_end:string|null;territory:string;medium:FilmRelease["medium"]}[]).map(row=>({category:row.category,editionId:row.edition_id,label:row.label,slug:row.slug,title:row.title,id:row.id,date:row.date,dateEnd:row.date_end,territory:row.territory,medium:row.medium,year:Number(row.date.slice(0,4))}));
}

export function getEpisodes(recordId: string): ArchiveEpisode[] {
  const citations=getCitations(recordId);
  const evidence=(type:string,key:string)=>citations.filter(c=>c.subjectType===type&&c.subjectKey===key);
  const rows=database().prepare("SELECT * FROM episodes WHERE record_id=? ORDER BY season,number_start").all(recordId) as {id:string;season:number;number_start:number;number_end:number;title:string;source_label:string;note:string}[];
  const credits=database().prepare("SELECT c.*,p.name FROM episode_credits c JOIN contributors p ON p.id=c.contributor_id JOIN episodes e ON e.id=c.episode_id WHERE e.record_id=? ORDER BY c.position").all(recordId) as {id:string;episode_id:string;name:string;role:string;credit_line:string}[];
  const links=database().prepare("SELECT l.*,r.category,r.slug,r.title FROM episode_links l JOIN records r ON r.id=l.target_id JOIN episodes e ON e.id=l.episode_id WHERE e.record_id=? ORDER BY r.category,r.title").all(recordId) as {id:string;episode_id:string;category:EpisodeConnection["category"];slug:string;title:string;relation:EpisodeConnection["relation"];note:string;representation:EpisodeConnection["representation"]}[];
  const reviews=database().prepare("SELECT v.* FROM episode_reviews v JOIN episodes e ON e.id=v.episode_id WHERE e.record_id=?").all(recordId) as {episode_id:string;checked_at:string;scope:string;notes:string}[];
  return rows.map(row=>({id:row.id,season:row.season,start:row.number_start,end:row.number_end,title:row.title,sourceLabel:row.source_label,note:row.note,connectionReview:(()=>{const review=reviews.find(r=>r.episode_id===row.id);return review?{checkedAt:review.checked_at,scope:review.scope,notes:JSON.parse(review.notes) as string[],evidence:evidence("episode_review",row.id)}:null;})(),evidence:evidence("episode",row.id),credits:credits.filter(c=>c.episode_id===row.id).map((c):EpisodeCredit=>({id:c.id,person:c.name,role:c.role,creditLine:c.credit_line,evidence:evidence("episode_credit",c.id)})),links:links.filter(l=>l.episode_id===row.id).map(l=>({id:l.id,category:l.category,slug:l.slug,title:l.title,relation:l.relation,note:l.note,representation:l.representation,evidence:evidence("episode_link",l.id)}))}));
}

/** Uncollapsed, directed archive links for the record graph. Reads only. */
export function getConnectionDetails(id: string) {
  const rows = database().prepare("SELECT record_id,target_id,relation,source_id,review_status FROM links WHERE record_id=? OR target_id=? ORDER BY relation,record_id,target_id").all(id,id) as {record_id:string;target_id:string;relation:string;source_id:string;review_status:string}[];
  const cache = new Map<string,Citation[]>();
  return rows.map(row => {
    if (!cache.has(row.record_id)) cache.set(row.record_id,getCitations(row.record_id));
    const key = `${row.record_id}|${row.target_id}|${row.relation}`;
    const evidence = cache.get(row.record_id)!.filter(c => c.subjectType === "link" && c.subjectKey === key);
    return {fromId:row.record_id,toId:row.target_id,relation:row.relation,reviewStatus:row.review_status,evidence:evidence.length?evidence:[{sourceId:row.source_id,locator:"",note:"",checkedAt:""}]};
  });
}
