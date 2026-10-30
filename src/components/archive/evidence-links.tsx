import type { Evidence } from "@/lib/archive/types";

export default function EvidenceLinks({evidence,index,label}:{evidence:Evidence[];index:Map<string,number>;label:string}){
  const refs=[...new Map(evidence.filter(e=>index.has(e.sourceId)).map(e=>[e.sourceId,e])).values()];
  return <span className="evidence-links">{refs.map(e=><a key={e.sourceId} href={`#source-${e.sourceId}`} aria-label={`Source ${index.get(e.sourceId)} for ${label}`} title={[e.locator,e.note,e.checkedAt?`Checked ${e.checkedAt}`:""].filter(Boolean).join(" · ")}>[{index.get(e.sourceId)}]</a>)}</span>;
}
