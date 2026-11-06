import {getRecord} from "@/lib/archive/database";
import {connectionSnapshot} from "@/lib/archive/connection-snapshot";
import {getNavigationRecords} from "@/lib/archive/navigation-data";
import {categoryKeys,type Category} from "@/lib/archive/types";
import {getConnectionPath} from "@/lib/archive/connection-path";
import MemoryComparison from "@/components/memory-comparison";
import "./compare.css";
import "./path.css";
export const metadata={title:"Compare memories — The Galactic Memory"};
export default async function ComparePage({searchParams}:{searchParams:Promise<{left?:string;right?:string;mode?:string;scope?:string}>}){
 const params=await searchParams;
 function resolve(value?:string){if(!value||value.length>220)return null;const [category,slug,...extra]=value.split("/");return categoryKeys.includes(category as Category)&&slug&&!extra.length?getRecord(category as Category,slug):null;}
 const left=resolve(params.left)??getRecord("people","leia-organa")!;
 const right=resolve(params.right)??getRecord("people",left.slug==="luke-skywalker"?"leia-organa":"luke-skywalker")!;
 return <MemoryComparison key={`${left.id}-${right.id}-${params.mode}-${params.scope}`} pathResult={params.mode==="path"?getConnectionPath(left,right,params.scope==="checked"):undefined} left={connectionSnapshot(left)} right={connectionSnapshot(right)} records={getNavigationRecords()} invalid={Boolean((params.left&&!resolve(params.left))||(params.right&&!resolve(params.right)))}/>;
}
