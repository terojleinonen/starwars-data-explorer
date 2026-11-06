import ResearchDesk from "@/components/research-desk";
import {getRecords,getRelated,getSources} from "@/lib/archive/database";
import "./research.css";
export const metadata={title:"Research desk — The Galactic Memory"};
export default async function ResearchPage({searchParams}:{searchParams:Promise<{add?:string}>}){
 const {add}=await searchParams,records=getRecords(),seen=new Set<string>();
 const edges=records.flatMap(r=>getRelated(r.id).flatMap(o=>{const id=[r.id,o.id].sort().join("|");if(seen.has(id))return [];seen.add(id);return [{id,from:r.id,to:o.id,relation:o.relation,status:o.reviewStatus,evidence:o.evidence}];}));
 return <ResearchDesk initialRecord={add} records={records.map(({id,title,category,slug,summary})=>({id,title,category,slug,summary}))} edges={edges} sources={getSources().map(({id,title,url})=>({id,title,url}))}/>;
}
