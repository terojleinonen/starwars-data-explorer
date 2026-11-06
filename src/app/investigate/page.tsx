import { getRecords, getRelated, getSources } from "@/lib/archive/database";
import MemoryNetwork, { type MemoryEdge } from "@/components/memory-network";
import "./network.css";

export const metadata = { title: "Follow the connections — The Galactic Memory" };
export default async function InvestigatePage({searchParams}:{searchParams:Promise<{record?:string}>}) {
 const {record:initialRecord}=await searchParams;
 const records=getRecords();
 const seen=new Set<string>();
 const edges:MemoryEdge[]=[];
 for(const record of records) for(const other of getRelated(record.id)) {
  const key=[record.id,other.id].sort().join("|");
  if(seen.has(key))continue;seen.add(key);
  edges.push({id:key,from:record.id,to:other.id,relation:other.relation,status:other.reviewStatus,evidence:other.evidence});
 }
 return <MemoryNetwork key={initialRecord??"default"} initialRecord={initialRecord} records={records} edges={edges} sources={getSources().map(s=>({id:s.id,title:s.title,url:s.url}))}/>;
}
