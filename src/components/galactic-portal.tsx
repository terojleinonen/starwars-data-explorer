"use client";
import { useState } from "react";
import Link from "next/link";
import "@/app/portal-atlas.css";
import {useMemoryLens,lensInfo} from "@/components/memory-preferences";
import { categoryKeys, recordHref, type ArchiveRecord, type ArchiveStats, type RelatedRecord } from "@/lib/archive/types";

const paths = [
 {id:"history",number:"01",label:"Follow the history",prompt:"I want to understand the story",description:"Find your place in the saga. Enter through a chapter, then discover the lives within it.",glyph:"◷"},
 {id:"find",number:"02",label:"Find a familiar name",prompt:"I know where I want to begin",description:"A person. A world. A ship. One familiar fragment can unlock the rest of the archive.",glyph:"⌕"},
 {id:"threads",number:"03",label:"Trace the connections",prompt:"I want to see the bigger picture",description:"Begin with one life. Follow its documented links through a much larger story.",glyph:"⌘"},
] as const;
const labels:Record<string,string>={films:"Films",series:"Series",people:"Characters",planets:"Worlds",starships:"Starships",vehicles:"Vehicles",species:"Species"};
const chapters=[{label:"Before",name:"The prequel trilogy",range:"I—III",min:1,max:3},{label:"The turning point",name:"The original trilogy",range:"IV—VI",min:4,max:6},{label:"After",name:"The sequel trilogy",range:"VII—IX",min:7,max:9}];
export default function GalacticPortal({records,stats,connections}:{records:ArchiveRecord[];stats:ArchiveStats;connections:RelatedRecord[]}) {
 const {lens}=useMemoryLens();
 const [path,setPath]=useState<typeof paths[number]["id"]>("history"),[chapter,setChapter]=useState(1),[query,setQuery]=useState("");
 const active=paths.find(p=>p.id===path)!;
 const selected=chapters[chapter];
 const films=records.filter(r=>r.category==="films"&&Number(r.facts.episode_id)>=selected.min&&Number(r.facts.episode_id)<=selected.max).sort((a,b)=>Number(a.facts.episode_id)-Number(b.facts.episode_id));
 const results=query.trim()?records.filter(r=>[r.title,r.summary].join(" ").toLowerCase().includes(query.trim().toLowerCase())).sort((a,b)=>Number(b.title.toLowerCase().includes(query.toLowerCase()))-Number(a.title.toLowerCase().includes(query.toLowerCase()))):[];
 return <div className="portal">
  <header className="portal-header"><Link href="/" className="portal-brand" aria-label="The Galactic Memory home"><span aria-hidden="true">◈</span><div>THE GALACTIC MEMORY<small>AN INDEPENDENT STAR WARS ARCHIVE</small></div></Link><span className="portal-header-whisper">SOMEWHERE BETWEEN HISTORY AND LEGEND.</span><Link href="/sources" prefetch={false} className="portal-provenance">The origin is unknown.<br/><span>The sources are not. ↗</span></Link></header>
  <main id="main">
   <div className="portal-intro"><p className="portal-kicker">THE MEMORY IS OPEN</p><h1>A thousand stories.<br/><em>Find your thread.</em></h1><p>You do not need to know the whole galaxy.<br/>You only need a place to begin.</p></div>
   <section className="portal-chamber" aria-label="Choose your way into the archive" id="discover">
    <div className="portal-paths" aria-label="Ways into the archive">{paths.map(p=><button key={p.id} aria-pressed={path===p.id} aria-controls="portal-gateway" onClick={()=>setPath(p.id)}><span className="portal-path-number">{p.number}</span><div><small>{p.prompt}</small><h2>{p.label}</h2></div><span className="portal-path-arrow" aria-hidden="true">↗</span></button>)}</div>
    <div className={`portal-hologram portal-hologram-${path}`} aria-hidden="true"><div className="portal-halo halo-a"/><div className="portal-halo halo-b"/><div className="portal-halo halo-c"/><div className="portal-axis"/><div className="portal-diamond"><i/><b/></div><span className="portal-orbit-dot dot-a"/><span className="portal-orbit-dot dot-b"/><span className="portal-orbit-dot dot-c"/><span className="portal-holo-caption">{active.number} / {path==="history"?"CHRONICLE":path==="find"?"RECOLLECTION":"CONNECTION"}</span><span className="portal-holo-origin">KEEPER · UNKNOWN</span></div>
    <div className="portal-gateway" id="portal-gateway" aria-label={active.label}>
     <div className="portal-gateway-heading"><span className="portal-kicker">{active.number} / YOUR POINT OF ENTRY</span><span aria-hidden="true">{active.glyph}</span></div>
     <h2>{active.label}</h2><p className="portal-description">{active.description}</p>
     {path==="history"&&<><div className="portal-chapter-switch" aria-label="Saga chapter">{chapters.map((c,i)=><button key={c.range} aria-pressed={chapter===i} onClick={()=>setChapter(i)}><small>{c.label}</small><span>{c.range}</span></button>)}</div><p className="portal-selection">{selected.name}<span>EPISODE ORDER</span></p><div className="portal-entry-links">{films.map(r=><Link key={r.id} href={recordHref(r)} prefetch={false}><span className="portal-entry-num">{r.facts.episode_id}</span><span>{r.title}</span><b>↗</b></Link>)}</div><Link href="/history" className="portal-footnote" style={{display:"block",color:"var(--p-gold)",marginTop:14}}>Enter the history atlas ↗</Link></>}
     {path==="find"&&<><label className="portal-search-label" htmlFor="portal-search">What do you remember?</label><div className="portal-search"><input id="portal-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Leia, Tatooine, Millennium Falcon…"/><span aria-hidden="true">⌕</span></div>{query.trim()?<><p className="portal-search-status" role="status">{results.length} records found{results.length>5?" · first 5 shown":""}</p><div className="portal-entry-links portal-search-results">{results.slice(0,5).map(r=><Link href={recordHref(r)} key={r.id} prefetch={false}><span><small>{labels[r.category]}</small>{r.title}</span><b>↗</b></Link>)}</div>{!results.length&&<p className="portal-footnote">Try a different name, or browse a collection below.</p>}</>:<p className="portal-footnote">Search by name or words in a record’s description.</p>}<div className="portal-collection-links">{categoryKeys.map(k=><Link key={k} href={`/${k}`} prefetch={false}>{labels[k]} <span>↗</span></Link>)}</div></>}
     {path==="threads"&&<><Link href="/investigate" prefetch={false} className="portal-seed"><small>BEGIN WITH A LIFE</small><strong>Darth Vader</strong><span>Enter the connection network ↗</span></Link><div className="portal-thread-branches">{["people","planets","starships"].map(cat=>{const r=connections.find(c=>c.category===cat&&c.reviewStatus==="verified");return r?<Link key={cat} href={recordHref(r)} prefetch={false}><span className="portal-branch-line"/><span><small>{labels[cat]}</small>{r.title}</span><b>↗</b></Link>:null;})}</div><p className="portal-footnote">Open the network to explore, recenter a memory, and inspect the evidence behind each connection.</p></>}
    </div>
   </section>
   <nav className="portal-atlas-links" aria-label="Explore history and worlds"><Link href="/history">◷ History atlas <span>Follow the saga</span></Link><Link href="/galaxy">◉ Galactic atlas <span>Discover the worlds</span></Link><Link href="/war-room">⌖ Rebel war map <span>Trace documented operations</span></Link></nav>
   <div className="portal-bottom-note" id="explore"><span>JEDI ARCHIVES <i>·</i> IMPERIAL RECORDS <i>·</i> HOLOCRON KNOWLEDGE</span><p>{lensInfo[lens].name} · One source-led collection.</p><Link href="/timeline" prefetch={false}>Looking for release history? ↗</Link></div>
  </main>
  <footer className="portal-overview" id="archive"><div className="portal-overview-label"><span className="portal-kicker">THE ARCHIVE / AT A GLANCE</span><p>A galaxy, held in fragments.</p></div><dl><div><dt>Preserved records</dt><dd>{stats.total.toLocaleString("en-US")}</dd></div><div><dt>Recorded connections</dt><dd>{stats.connections.toLocaleString("en-US")}</dd></div><div><dt>Films &amp; series</dt><dd>{stats.counts.films+stats.counts.series}</dd></div><div><dt>Collections</dt><dd>{categoryKeys.length.toString().padStart(2,"0")}</dd></div></dl><div className="portal-overview-end"><Link href="/sources" prefetch={false}>Sources &amp; provenance ↗</Link><small>Independent fan archive.<br/>Not affiliated with Lucasfilm.</small></div></footer>
 </div>;
}
