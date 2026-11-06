"use client";
import {useCallback,useEffect,useRef,useState} from "react";
import Link from "next/link";
import PinMemory from "@/components/pin-memory";
import {GraphMemoryTransition,GraphLinksTransition,useGraphMotion} from "@/components/graph-motion";
import {ExplorationGuide,EvidenceReturn,focusEvidence,evidenceEscape} from "@/components/exploration-guidance";
import {useMemoryLens,memoryPriority,lensInfo} from "@/components/memory-preferences";
import {categoryKeys,recordHref,type ArchiveRecord,type RelatedRecord} from "@/lib/archive/types";
type Source={id:string;title:string;url:string};
type Neighbor=RelatedRecord&{summary?:string};
type Snapshot={record:ArchiveRecord;related:Neighbor[];sources:Source[]};
const labels:Record<string,string>={films:"Films",series:"Series",people:"Characters",planets:"Worlds",starships:"Starships",vehicles:"Vehicles",species:"Species"};
const marks:Record<string,string>={people:"○",films:"▯",series:"▤",planets:"◉",starships:"◇",vehicles:"△",species:"⬡"};
const keyFor=(r:Pick<ArchiveRecord,"category"|"slug">)=>`${r.category}/${r.slug}`;
export default function RecordConstellation(initial:Snapshot){
 const {lens}=useMemoryLens();
 const {move,pending}=useGraphMotion();
 const [origin,setOrigin]=useState<{href:string;label:string}|null>(null);
 useEffect(()=>{let active=true;queueMicrotask(()=>{if(!active)return;const candidate=new URLSearchParams(location.search).get("exploreFrom");if(candidate&&candidate.length<10000&&candidate.startsWith("/compare?")){try{const url=new URL(candidate,location.origin);if(url.origin===location.origin&&url.pathname==="/compare")setOrigin({href:url.pathname+url.search,label:url.searchParams.get("mode")==="path"?"connection path":"comparison"});}catch{}}});return()=>{active=false;};},[initial.record.id]);
 const [restored,setRestored]=useState(false),[shareMessage,setShareMessage]=useState(""),[shareFallback,setShareFallback]=useState("");
 const [snapshot,setSnapshot]=useState(initial),[trail,setTrail]=useState([initial.record]),[selected,setSelected]=useState<string|null>(null),[filter,setFilter]=useState("all"),[view,setView]=useState("network"),[page,setPage]=useState(0),[busy,setBusy]=useState(false),[error,setError]=useState("");
 const cache=useRef(new Map([[initial.record.id,initial]]));const request=useRef(0);const inspector=useRef<HTMLElement>(null);
 const {record,related,sources}=snapshot;
 const centerButton=useRef<HTMLButtonElement>(null);const previousCenter=useRef(record.id);
 function returnToGraph(){centerButton.current?.scrollIntoView({block:"center",behavior:window.matchMedia("(prefers-reduced-motion:reduce)").matches?"instant":"smooth"});centerButton.current?.focus({preventScroll:true});}
 useEffect(()=>{if(previousCenter.current!==record.id){previousCenter.current=record.id;centerButton.current?.focus({preventScroll:true});if(window.matchMedia("(max-width:850px)").matches)returnToGraph();}},[record.id]);
 useEffect(()=>{
  let cancelled=false;
  async function restore(){
   const params=new URLSearchParams(location.search),encoded=params.get("gmTrail");
   setBusy(true);
   try{
    const keys=encoded?encoded.split(","):[keyFor(initial.record)];
    if(keys.length>200||keys[0]!==keyFor(initial.record))throw new Error();
    let next=initial;const restoredTrail=[initial.record];
    for(const key of keys.slice(1)){
     const candidate=next.related.find(r=>keyFor(r)===key);if(!candidate)throw new Error();
     let loaded=cache.current.get(candidate.id);
     if(!loaded){const response=await fetch(`/api/connections?category=${encodeURIComponent(candidate.category)}&slug=${encodeURIComponent(candidate.slug)}`);if(!response.ok)throw new Error();loaded=await response.json() as Snapshot;cache.current.set(candidate.id,loaded);}
     if(cancelled)return;next=loaded;restoredTrail.push(next.record);
    }
    if(cancelled)return;
    const node=params.get("gmNode"),category=params.get("gmFilter"),savedPage=Number(params.get("gmPage")??0);
    setSnapshot(next);setTrail(restoredTrail);setSelected(node&&(node===next.record.id||next.related.some(r=>r.id===node))?node:null);
    setFilter(categoryKeys.includes(category as typeof categoryKeys[number])?category!:"all");setPage(Number.isInteger(savedPage)&&savedPage>=0?Math.min(savedPage,10000):0);setView(params.get("gmView")==="list"?"list":"network");
   }catch{if(!cancelled)setError("This shared path could not be restored. The original record is available; you can begin a new exploration here.");}
   finally{if(!cancelled){setBusy(false);setRestored(true);}}
  }
  void restore();return()=>{cancelled=true;};
 },[initial]);
 const unique=[...new Map(related.map(r=>[r.id,r])).values()];
 const ordered=unique.sort((a,b)=>memoryPriority(a.category,lens)-memoryPriority(b.category,lens)||Number(b.reviewStatus==="verified")-Number(a.reviewStatus==="verified")||a.title.localeCompare(b.title));
 const filtered=ordered.filter(r=>filter==="all"||r.category===filter),pages=Math.max(1,Math.ceil(filtered.length/6)),safePage=Math.min(page,pages-1),shown=filtered.slice(safePage*6,safePage*6+6);
 const active=unique.find(r=>r.id===selected);const connections=related.filter(r=>r.id===selected);
 const explorationUrl=useCallback(()=>{
  const url=new URL(location.href);
  if(trail.length>1)url.searchParams.set("gmTrail",trail.map(keyFor).join(","));else url.searchParams.delete("gmTrail");
  if(selected)url.searchParams.set("gmNode",selected);else url.searchParams.delete("gmNode");
  if(filter!=="all")url.searchParams.set("gmFilter",filter);else url.searchParams.delete("gmFilter");
  if(safePage>0)url.searchParams.set("gmPage",String(safePage));else url.searchParams.delete("gmPage");
  if(view!=="network")url.searchParams.set("gmView",view);else url.searchParams.delete("gmView");
  return url;
 },[trail,selected,filter,safePage,view]);
 useEffect(()=>{if(!restored||busy)return;const url=explorationUrl();history.replaceState(history.state,"",url.pathname+url.search+url.hash);let active=true;queueMicrotask(()=>{if(active){setShareMessage("");setShareFallback("");}});return()=>{active=false;};},[restored,busy,explorationUrl]);
 async function share(){const url=explorationUrl();url.hash="record-connections";try{await navigator.clipboard.writeText(url.href);setShareMessage("Exploration link copied. It includes your path and selected memory.");setShareFallback("");}catch{setShareFallback(url.href);setShareMessage("Copy this exploration link:");}}
 function historicalContextUrl(){const url=explorationUrl();url.hash="record-connections";return `/history?record=${encodeURIComponent(active?.id??record.id)}&returnTo=${encodeURIComponent(url.pathname+url.search+url.hash)}`;}
 function position(i:number){if(lens==="imperial")return{x:18+(i%3)*32,y:i<3?17:83};const angle=2*Math.PI*i/shown.length-Math.PI/2;return{x:50+33*Math.cos(angle),y:50+36*Math.sin(angle)};}
 function inspect(id:string){setSelected(id);setError("");focusEvidence(inspector.current,850);}

 async function focus(target:Pick<ArchiveRecord,"id"|"category"|"slug">,backIndex?:number){
  const token=++request.current;setBusy(true);setError("");
  try{let next=cache.current.get(target.id);if(!next){const response=await fetch(`/api/connections?category=${encodeURIComponent(target.category)}&slug=${encodeURIComponent(target.slug)}`);if(!response.ok)throw new Error();next=await response.json() as Snapshot;cache.current.set(target.id,next);}
   if(token!==request.current)return;const loaded=next;if(view==="network"&&window.matchMedia("(max-width:850px)").matches)centerButton.current?.scrollIntoView({block:"center",behavior:"instant"});move(()=>{setSnapshot(loaded);setTrail(old=>backIndex===undefined?[...old,loaded.record]:old.slice(0,backIndex+1));setSelected(null);setFilter("all");setPage(0);setBusy(false);});
  }catch{if(token===request.current){setError("This memory could not be loaded. Your current constellation is still here. Try again.");setBusy(false);}}
 }
 return <section className="record-constellation rc-explorer" aria-label={`Connections of ${record.title}`} aria-busy={busy||pending}>
 <header className="rc-heading"><div><p className="eyebrow">{lensInfo[lens].name} / CONNECTED MEMORY</p><h2>Follow a thread.</h2><p className="rc-intro">One memory at the center. Choose a connection to see what joins them.</p></div><div className="rc-view" aria-label="Connection presentation"><button aria-pressed={view==="network"} onClick={()=>setView("network")}>Network</button><button aria-pressed={view==="list"} onClick={()=>setView("list")}>List</button></div></header>
 {origin&&<div className="exploration-context"><Link href={origin.href}>← Back to {origin.label}</Link><p>You can return to the same pair after exploring this record.</p></div>}<ExplorationGuide mode="graph"/><div className="rc-share"><button disabled={!restored||busy} onClick={share}>Copy exploration link ↗</button><Link prefetch={false} href={restored?historicalContextUrl():`/history?record=${encodeURIComponent(record.id)}`}>View {active?.title??record.title} in history →</Link><Link prefetch={false} href={`/compare?left=${encodeURIComponent(keyFor(active??record))}`}>Compare {active?.title??record.title} with another memory ⇄</Link><p role="status">{shareMessage}</p>{shareFallback&&<input aria-label="Exploration link" readOnly value={shareFallback} onFocus={e=>e.target.select()}/>}</div>
 <nav className="rc-trail" aria-label="Constellation exploration path">{trail.map((r,i)=><button disabled={busy||pending} key={`${r.id}-${i}`} aria-current={i===trail.length-1?"location":undefined} onClick={()=>focus(r,i)}>{i>0&&<span aria-hidden="true">› </span>}{r.title}</button>)}{trail.length>1&&<button disabled={busy||pending} className="rc-back" onClick={()=>focus(trail[trail.length-2],trail.length-2)}>← Back one step</button>}</nav>
 <nav className="rc-filters" aria-label="Connection categories"><button aria-pressed={filter==="all"} onClick={()=>{setFilter("all");setPage(0);setSelected(null);}}>All · {unique.length}</button>{categoryKeys.filter(k=>unique.some(r=>r.category===k)).map(k=><button key={k} aria-pressed={filter===k} onClick={()=>{setFilter(k);setPage(0);setSelected(null);}}>{labels[k]} · {unique.filter(r=>r.category===k).length}</button>)}</nav>
 <div role="status" className="rc-loading">{busy?"Opening the next constellation…":`${record.title} · ${unique.length} connected memories`}</div>{error&&<p role="alert" className="rc-error">{error}</p>}
 <div className="rc-workspace"><div className="rc-map-area">{view==="network"?<div className="rc-canvas"><GraphLinksTransition graph="record" center={record.id}><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><ellipse className="rc-orbit" cx="50" cy="50" rx="33" ry="36"/>{shown.map((r,i)=>{const p=position(i);return <line key={r.id} x1="50" y1="50" x2={p.x} y2={p.y} className={`${r.reviewStatus==="verified"?"":"rc-pending"} ${selected===r.id?"rc-active-line":""}`}/>;})}</svg></GraphLinksTransition><GraphMemoryTransition graph="record" id={record.id} key={record.id}><button ref={centerButton} className="rc-center" onClick={()=>inspect(record.id)} aria-label={`Inspect ${record.title}, current center`}><span>{marks[record.category]}</span><strong>{record.title}</strong><small>CURRENT CENTER</small></button></GraphMemoryTransition>{shown.map((r,i)=>{const p=position(i);return <GraphMemoryTransition graph="record" id={r.id} key={r.id}><button className={`rc-node ${selected===r.id?"rc-selected":""}`} style={{left:`${p.x}%`,top:`${p.y}%`}} key={r.id} onClick={()=>inspect(r.id)} aria-pressed={selected===r.id} aria-label={`Inspect connection to ${r.title}`}><span data-category={r.category}>{marks[r.category]}</span><strong>{r.title}</strong><small>{labels[r.category]} · {r.reviewStatus==="verified"?"✓":"○"}</small></button></GraphMemoryTransition>})}{!shown.length&&<p className="rc-empty">No connections recorded yet.</p>}</div>:<div className="rc-list">{filtered.map(r=><button key={r.id} aria-pressed={selected===r.id} onClick={()=>inspect(r.id)}><span>{marks[r.category]} {r.title}</span><small>{labels[r.category]} · {r.reviewStatus==="verified"?"Checked":"Review pending"}</small></button>)}{!filtered.length&&<p>No connections recorded yet.</p>}</div>}
 <div className="rc-pagination"><span>{view==="network"?`${filtered.length?safePage*6+1:0}–${Math.min(safePage*6+6,filtered.length)}`:filtered.length} of {filtered.length} memories</span>{view==="network"&&pages>1&&<div><button disabled={safePage===0} onClick={()=>{setPage(safePage-1);setSelected(null);}} aria-label="Previous connections">←</button><span>{safePage+1} / {pages}</span><button disabled={safePage===pages-1} onClick={()=>{setPage(safePage+1);setSelected(null);}} aria-label="Next connections">→</button></div>}</div><div className="rc-legend"><span>— Checked &nbsp; ┄ Pending / reference</span><span>Links, not map coordinates</span></div></div>
 <aside ref={inspector} tabIndex={-1} className="rc-inspector" aria-label="Selected memory and connection evidence" onKeyDown={e=>evidenceEscape(e,'.rc-node[aria-pressed="true"],.rc-list button[aria-pressed="true"]',".rc-center")}><EvidenceReturn target={'.rc-node[aria-pressed="true"],.rc-list button[aria-pressed="true"]'} fallback=".rc-center"/><PinMemory key={(active??record).id} record={active??record}/>{active?<><p className="eyebrow">CONNECTED MEMORY / {labels[active.category]}</p><h3>{active.title}</h3><p>{active.summary||"No narrative summary is recorded for this memory. Its preserved details are available in the complete record."}</p><button disabled={busy||pending} className="rc-primary" onClick={()=>focus(active)}>Explore from here ◎</button><Link className="rc-record-link" href={recordHref(active)} prefetch={false}>Open full record ↗</Link><div className="rc-evidence">{connections.map((connection,c)=><section key={c}><p className="eyebrow">THE DOCUMENTED CONNECTION</p><h4>{record.title} ↔ {active.title}</h4><dl><dt>Recorded relation</dt><dd>{connection.relation.replaceAll("_"," ")}</dd><dt>Review status</dt><dd>{connection.reviewStatus==="verified"?"✓ Checked with sources":connection.reviewStatus==="reference"?"Reference only":"○ Review pending"}</dd></dl>{connection.evidence.length===0&&<p>No individual source citation is attached to this connection.</p>}{connection.evidence.map((e,i)=>{const source=sources.find(s=>s.id===e.sourceId);return <div className="rc-citation" key={i}>{source?<a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a>:<span>Source {e.sourceId}</span>}{e.locator&&<p>{e.locator}</p>}{e.note&&<p>{e.note}</p>}{e.checkedAt&&<small>Checked {e.checkedAt}</small>}</div>})}</section>)}</div></>:<><p className="eyebrow">CURRENT CENTER / {labels[record.category]}</p><h3>{record.title}</h3><p>{record.summary||"No narrative summary is recorded for this memory."}</p><p>Select a memory to inspect its connection and sources. Choose “Explore from here” to make it the center.</p>{record.id!==initial.record.id&&<Link className="rc-record-link" href={recordHref(record)} prefetch={false}>Open full record ↗</Link>}<Link className="rc-record-link" href={`/investigate?record=${encodeURIComponent(record.id)}`} prefetch={false}>Open the full archive explorer ↗</Link><small className="rc-scope">{unique.length} direct connections. Archive perspectives change presentation, not the underlying records.</small></>}</aside></div>
 </section>;
}
