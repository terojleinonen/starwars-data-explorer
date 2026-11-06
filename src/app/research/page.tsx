import ResearchDesk from "@/components/research-desk";
import {getRecords,getConnectionDetails,getSources} from "@/lib/archive/database";
import "./research.css";
export const metadata={title:"Research desk — The Galactic Memory"};
export default async function ResearchPage({searchParams}:{searchParams:Promise<{add?:string}>}){
 const {add}=await searchParams,records=getRecords(),seen=new Set<string>();
 const grouped=new Map<string,{id:string;from:string;to:string;relation:string;status:string;evidence:ReturnType<typeof getConnectionDetails>[number]["evidence"];relations:ReturnType<typeof getConnectionDetails>}>();
 for(const record of records)for(const detail of getConnectionDetails(record.id)){
  const key=JSON.stringify([detail.fromId,detail.toId,detail.relation]);if(seen.has(key))continue;seen.add(key);
  const [from,to]=[detail.fromId,detail.toId].sort(),id=`${from}|${to}`,existing=grouped.get(id);
  if(existing){existing.relations.push(detail);if(detail.reviewStatus==="verified")existing.status="verified";}
  else grouped.set(id,{id,from,to,relation:detail.relation,status:detail.reviewStatus,evidence:detail.evidence,relations:[detail]});
 }
 const edges=[...grouped.values()];
 return <ResearchDesk initialRecord={add} records={records.map(({id,title,category,slug,summary})=>({id,title,category,slug,summary}))} edges={edges} sources={getSources().map(({id,title,url})=>({id,title,url}))}/>;
}
