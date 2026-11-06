import {getRecord,getRelated,getSources,getConnectionDetails} from "@/lib/archive/database";
import type {ArchiveRecord} from "@/lib/archive/types";
export function connectionSnapshot(record:ArchiveRecord){
 const related=getRelated(record.id).map(r=>({...r,summary:getRecord(r.category,r.slug)?.summary??""}));
 const details=getConnectionDetails(record.id);
 const ids=new Set(details.flatMap(r=>r.evidence.map(e=>e.sourceId)));
 return {record,related,details,sources:getSources().filter(s=>ids.has(s.id)).map(s=>({id:s.id,title:s.title,url:s.url}))};
}
