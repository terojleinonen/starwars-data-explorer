"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { categoryKeys, recordHref, type ArchiveRecord } from "@/lib/archive/types";

const chapters = [
  { name: "The prequel chapters", subtitle: "Episodes I—III", min: 1, max: 3, numeral: "I", heading: "Before the original trilogy" },
  { name: "The original chapters", subtitle: "Episodes IV—VI", min: 4, max: 6, numeral: "II", heading: "The original trilogy" },
  { name: "The sequel chapters", subtitle: "Episodes VII—IX", min: 7, max: 9, numeral: "III", heading: "Beyond the original trilogy" },
];
const labels: Record<string,string> = {films:"Films",series:"Series",people:"People",planets:"Worlds",starships:"Starships",vehicles:"Vehicles",species:"Species"};
const lenses = [ {id:"all",name:"All memories",hint:"Search the entire preserved collection."}, {id:"jedi",name:"Jedi archives",hint:"A thematic search for Jedi, the Force, Sith, and apprentices."}, {id:"imperial",name:"Imperial records",hint:"A thematic search for the Empire, Imperial service, and rebellion."}, {id:"holocron",name:"Holocron knowledge",hint:"A thematic search for knowledge, teachings, holocrons, and the Force."} ];
const patterns:Record<string,RegExp> = {jedi:/\bjedi\b|\bsith\b|\bforce\b|apprentice/i, imperial:/\bimperial\b|\bempire\b|rebellion|\brebel\b/i,holocron:/holocron|knowledge|teaching|\bforce\b/i};
export default function MemoryExplorer({records}:{records:ArchiveRecord[]}) {
 const [chapter,setChapter]=useState(1),[lens,setLens]=useState("all"),[category,setCategory]=useState("all"),[query,setQuery]=useState(""),[limit,setLimit]=useState(12);
 const selected=chapters[chapter];
 const works=records.filter(r=>r.category==="films" && Number(r.facts.episode_id)>=selected.min && Number(r.facts.episode_id)<=selected.max).sort((a,b)=>Number(a.facts.episode_id)-Number(b.facts.episode_id));
 const results=useMemo(()=>records.filter(r=>{
 const text=[r.title,r.summary,...Object.values(r.facts)].join(" ");
 return (category==="all"||r.category===category)&&(lens==="all"||patterns[lens].test(text))&&text.toLowerCase().includes(query.trim().toLowerCase());
 }),[records,category,lens,query]);
 return <>
 <section className="memory-discover" id="discover"><div className="memory-section-top"><div><p className="memory-eyebrow">01 / DISCOVER</p><h2>History is the way in.</h2></div><p>Start with a chapter of the saga.<br/>Then follow the people and places within it.</p></div>
 <div className="memory-chapters" role="tablist" aria-label="Saga chapters">{chapters.map((c,i)=><button key={c.name} id={`chapter-${i}`} role="tab" aria-selected={chapter===i} aria-controls="chapter-panel" tabIndex={chapter===i?0:-1} onKeyDown={e=>{if(e.key==="ArrowRight"||e.key==="ArrowLeft"){e.preventDefault();const n=(i+(e.key==="ArrowRight"?1:2))%3;setChapter(n);document.getElementById(`chapter-${n}`)?.focus();}}} onClick={()=>setChapter(i)}><span>{c.numeral}</span><div><small>{c.subtitle}</small><strong>{c.name}</strong></div><b>↗</b></button>)}</div>
 <div id="chapter-panel" role="tabpanel" aria-labelledby={`chapter-${chapter}`} className="memory-chapter-panel"><div className="memory-chapter-context"><p className="memory-eyebrow">A CHAPTER REMEMBERED</p><h3>{selected.heading}</h3><p>Read these records in episode order, then enter a film to uncover its documented connections.</p><small>This is saga order, not a dated historical chronology. The existing data does not provide a complete BBY / ABY timeline.</small></div><div className="memory-events">{works.map(r=><Link key={r.id} href={recordHref(r)} prefetch={false}><span className="memory-episode">{String(r.facts.episode_id).padStart(2,"0")}</span><div><small>EPISODE {r.facts.episode_id} · {r.connectionCount} CONNECTIONS</small><h3>{r.title}</h3><p>{r.summary}</p></div><span>↗</span></Link>)}</div></div></section>
 <span id="archive" aria-hidden="true"/><section id="explore" className="memory-explore"><div className="memory-section-top"><div><p className="memory-eyebrow">02 / EXPLORE</p><h2>Follow a fragment.</h2></div><p>A familiar name can open a whole galaxy.</p></div>
 <div className="memory-search"><span aria-hidden="true">⌕</span><input type="search" aria-label="Search all archive records" placeholder="A person, a world, a ship…" value={query} onChange={e=>{setQuery(e.target.value);setLimit(12);}}/><span>{results.length} RECORDS</span></div>
 <div className="memory-lenses" aria-label="Thematic archive lenses">{lenses.map(l=><button key={l.id} aria-pressed={lens===l.id} onClick={()=>{setLens(l.id);setLimit(12);}}>{l.name}</button>)}</div><p className="memory-lens-note">{lenses.find(l=>l.id===lens)?.hint} These lenses match existing record text.</p>
 <div className="memory-filters" aria-label="Collections"><button aria-pressed={category==="all"} onClick={()=>{setCategory("all");setLimit(12);}}>All collections</button>{categoryKeys.map(k=><button key={k} aria-pressed={category===k} onClick={()=>{setCategory(k);setLimit(12);}}>{labels[k]}</button>)}</div>
 <p className="memory-result-count" role="status">{results.length} {results.length===1?"record":"records"} found{query?` for “${query}”`:""} · showing {Math.min(limit,results.length)}</p>
 <div className="memory-records">{results.slice(0,limit).map(r=><Link href={recordHref(r)} key={r.id} prefetch={false}><div className="memory-record-top"><span>{labels[r.category]}</span><span>↗</span></div><h3>{r.title}</h3><p>{r.summary}</p><div className="memory-record-bottom"><span>{r.connectionCount} connections</span><span>{r.reviewStatus==="legacy"?"Inherited record":"Editorial record"}</span></div></Link>)}</div>
 {!results.length&&<div className="memory-empty"><h3>No fragments found.</h3><p>Try another name or clear the filters.</p><button onClick={()=>{setQuery("");setLens("all");setCategory("all");}}>Reset search</button></div>}
 {results.length>limit&&<button className="memory-load" onClick={()=>setLimit(limit+12)}>Reveal more records <span>↓</span></button>}
 </section></>;
}
