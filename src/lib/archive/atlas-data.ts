import { DatabaseSync } from "node:sqlite";
import { join } from "node:path";
import { getRecords, getFacts, getSources, getRelated, getCitations } from "@/lib/archive/database";
import type { Evidence } from "@/lib/archive/types";

export function getAtlasData(){
 const records=getRecords();
 const worldRecords=records.filter(r=>r.category==="planets");
 const worlds=worldRecords.map(record=>({record,geography:getFacts(record.id).filter(f=>["region","system","location","location_type","site_type"].includes(f.key)&&f.reviewStatus==="verified"),connections:getRelated(record.id).filter(r=>r.reviewStatus==="verified")}));
 const works=records.filter(r=>r.category==="films"||r.category==="series").map(record=>({record,worldIds:getRelated(record.id).filter(r=>r.category==="planets"&&r.reviewStatus==="verified").map(r=>r.id),evidence:getCitations(record.id).filter(c=>c.subjectType==="summary")}));
 const db=new DatabaseSync(join(process.cwd(),"data","archive.sqlite"),{readOnly:true});
 const relations=["attacked","occupied","temporarily_occupied","deployed_at","fought_on","destroyed_near","destroyed","captured","invaded","defends","staged_at","led_mission_on","operated_above","operated_at","operated_from","targeted"];
 const rows=db.prepare(`SELECT l.record_id,l.target_id,l.relation,l.source_id FROM links l JOIN records a ON a.id=l.record_id JOIN records b ON b.id=l.target_id WHERE l.review_status='verified' AND (a.category='planets' OR b.category='planets') AND l.relation IN (${relations.map(()=>"?").join(",")}) ORDER BY a.title,b.title`).all(...relations) as {record_id:string;target_id:string;relation:string;source_id:string}[];
 db.close();
 const operations=rows.map((r,i)=>{const key=`${r.record_id}|${r.target_id}|${r.relation}`;const evidence:Evidence[]=getCitations(r.record_id).filter(c=>c.subjectType==="link"&&c.subjectKey===key);return {id:`operation-${i}`,from:r.record_id,to:r.target_id,relation:r.relation,evidence:evidence.length?evidence:[{sourceId:r.source_id,locator:"",note:"",checkedAt:""}]};});
 return {records,worlds,works,operations,sources:getSources().map(s=>({id:s.id,title:s.title,url:s.url}))};
}
export type AtlasData=ReturnType<typeof getAtlasData>;
