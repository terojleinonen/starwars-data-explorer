import {getRecords,getRelated,getSources} from "@/lib/archive/database";
import {shortestPath} from "@/lib/archive/shortest-path";
import type {ArchiveRecord,RelatedRecord} from "@/lib/archive/types";
export type ConnectionPathResult={nodes:ArchiveRecord[]|null;hops:{from:ArchiveRecord;to:ArchiveRecord;connection:RelatedRecord}[];sources:{id:string;title:string;url:string}[];checkedOnly:boolean};
export function getConnectionPath(start:ArchiveRecord,end:ArchiveRecord,checkedOnly:boolean):ConnectionPathResult{
 const records=new Map(getRecords().map(r=>[r.id,r])),adjacent=new Map<string,RelatedRecord[]>();
 function neighbors(id:string){let related=adjacent.get(id);if(!related){related=getRelated(id).filter(r=>records.has(r.id)&&(!checkedOnly||r.reviewStatus==="verified")).sort((a,b)=>a.title.localeCompare(b.title)||a.id.localeCompare(b.id));adjacent.set(id,related);}return related;}
 const ids=shortestPath(start.id,end.id,id=>neighbors(id).map(r=>r.id));
 const nodes=ids?.map(id=>records.get(id)!)??null;
 const hops=ids?.slice(0,-1).map((id,i)=>({from:records.get(id)!,to:records.get(ids[i+1])!,connection:neighbors(id).find(r=>r.id===ids[i+1])!}))??[];
 const sources=new Set(hops.flatMap(h=>h.connection.evidence.map(e=>e.sourceId)));
 return{nodes,hops,sources:getSources().filter(s=>sources.has(s.id)).map(s=>({id:s.id,title:s.title,url:s.url})),checkedOnly};
}
