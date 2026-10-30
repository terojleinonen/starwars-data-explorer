"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { categories, formatFact, labelFor, romanEpisode } from "@/lib/archive/config";
import { recordHref, type ArchiveRecord, type Category } from "@/lib/archive/types";
import ArchiveGlyph from "./glyph";
import ArchiveLabel, { departmentFor } from "./archive-label";
import TitleCard, { titleCardDesign } from "./title-card";
import { Arrow } from "../icons";

export function RecordCover({record}:{record:ArchiveRecord}) {
  const design = titleCardDesign(record);
  if (design) return <TitleCard record={record} design={design}/>;
  const media = record.category==="films"||record.category==="series";
  const initials = record.title.split(/[\s-]+/).slice(0,2).map(part=>part[0]).join("");
  return <div className={`record-cover cover-${record.category}`} aria-hidden="true">
    <span className="cover-topline">{media?"ARCHIVE EDITION":categories[record.category].motif}<span>✦</span></span>
    {media?<><span className="cover-episode">{record.facts.episode_id?`EPISODE ${romanEpisode(record.facts.episode_id)}`:record.category==="series"?"A TELEVISION STORY":"A CINEMATIC STORY"}</span><span className="cover-title">{record.title}</span><span className="cover-year">{record.year}</span></>:<><ArchiveGlyph category={record.category}/>{record.category==="people"&&<span className="cover-initials">{initials}</span>}<span className="cover-caption">{categories[record.category].singular.toUpperCase()} / {record.legacyId?.padStart(3,"0")??"NEW"}</span></>}
  </div>;
}

export default function Catalogue({records,category}:{records:ArchiveRecord[];category:Category}) {
  const config=categories[category];
  const media=category==="films"||category==="series";
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState("all");
  const [era,setEra]=useState("all");
  const [sort,setSort]=useState(media?"year":"archive");
  const [view,setView]=useState<"grid"|"list">(media||category==="planets"||category==="species"?"grid":"list");
  const [page,setPage]=useState(1);
  const [selected,setSelected]=useState<string|null>(null);
  const options=useMemo(()=>[...new Set(records.map(record=>record.facts[config.filter]).filter(Boolean))].sort(),[records,config.filter]);
  const filtered=useMemo(()=>records.filter(record=>(!search||`${record.title} ${Object.values(record.facts).join(" ")}`.toLowerCase().includes(search.toLowerCase()))&&(filter==="all"||record.facts[config.filter]===filter)&&(era==="all"||record.era===era)).sort((a,b)=>sort==="az"?a.title.localeCompare(b.title):sort==="za"?b.title.localeCompare(a.title):sort==="newest"?(b.year??0)-(a.year??0):sort==="year"?(a.year??0)-(b.year??0):Number(a.legacyId??9999)-Number(b.legacyId??9999)),[records,search,filter,era,sort,config.filter]);
  const pageSize=media?12:15;
  const totalPages=Math.max(1,Math.ceil(filtered.length/pageSize));
  const currentPage=Math.min(page,totalPages);
  const visible=filtered.slice((currentPage-1)*pageSize,currentPage*pageSize);
  const preview=visible.find(record=>record.id===selected)??visible[0];
  const reset=()=>{setSearch("");setFilter("all");setEra("all");setPage(1);};
  return <section className="catalogue" aria-label={`${config.label} catalogue`} style={{"--archive-accent":config.accent} as CSSProperties}>
    <div className="catalogue-toolbar">
      <label className="catalogue-search"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/></svg><span className="sr-only">Search {config.label.toLowerCase()}</span><input type="search" value={search} placeholder={`Search ${config.label.toLowerCase()}…`} onChange={event=>{setSearch(event.target.value);setPage(1);}}/></label>
      <label className="catalogue-select"><span>{config.filterLabel}</span><select value={filter} onChange={event=>{setFilter(event.target.value);setPage(1);}}><option value="all">All {config.filterLabel==="Class"?"classes":`${config.filterLabel.toLowerCase()}s`}</option>{options.map(option=><option key={option} value={option}>{option}</option>)}</select></label>
      <label className="catalogue-select sort-select"><span>Sort by</span><select value={sort} onChange={event=>{setSort(event.target.value);setPage(1);}}>{!media&&<option value="archive">Archive order</option>}{media&&<><option value="year">Release · oldest first</option><option value="newest">Release · newest first</option></>}<option value="az">Name · A–Z</option><option value="za">Name · Z–A</option></select></label>
      <div className="view-controls" role="group" aria-label="Catalogue layout"><button type="button" aria-label="Grid view" aria-pressed={view==="grid"} onClick={()=>setView("grid")}><svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M2 2h6v6H2zM12 2h6v6h-6zM2 12h6v6H2zM12 12h6v6h-6z"/></svg></button><button type="button" aria-label="List view" aria-pressed={view==="list"} onClick={()=>setView("list")}><svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 4h14M3 10h14M3 16h14"/></svg></button></div>
    </div>
    <div className="catalogue-meta"><div className="era-filters" role="group" aria-label="Creative era">{(media?["all","Lucas","Disney","Across eras"]:["all"]).map(value=><button key={value} type="button" aria-pressed={era===value} onClick={()=>{setEra(value);setPage(1);}}>{value==="all"?"All records":value==="Across eras"?"Across eras":`${value} years`}</button>)}</div><p aria-live="polite">{filtered.length} <span>of {records.length} records</span></p></div>
    {filtered.length===0?<div className="archive-empty"><span>NO SIGNAL</span><h2>No matching records.</h2><p>Try a different name or clear your filters.</p><button type="button" onClick={reset}>Clear filters <Arrow/></button></div>:view==="grid"?<div className={`record-grid ${media?"media-grid":"entity-grid"}`}>{visible.map(record=><Link key={record.id} href={recordHref(record)} prefetch={false} className="record-card"><RecordCover record={record}/><div className="record-card-caption"><div><span className="record-card-label">{media?`${record.era.toUpperCase()} YEARS`:formatFact(config.fields[0],record.facts[config.fields[0]])}</span><h3>{record.title}</h3><p>{media?record.facts.collection??record.facts.format:formatFact(config.fields[1],record.facts[config.fields[1]])}</p></div><Arrow diagonal/></div></Link>)}</div>:<div className="catalogue-split"><div className="record-list"><div className="record-list-head"><span>RECORD</span><span>{media?"RELEASE":labelFor(config.fields[0]).toUpperCase()}</span></div>{visible.map((record,index)=><div className="record-list-row" key={record.id} data-selected={preview?.id===record.id}><span className="record-list-number">{String((currentPage-1)*pageSize+index+1).padStart(3,"0")}</span><Link href={recordHref(record)} prefetch={false} className="record-list-identity"><strong>{record.title}</strong><small>{media?record.facts.collection??record.facts.format:formatFact(config.fields[1],record.facts[config.fields[1]])}</small></Link><span className="record-list-fact">{media?record.year:formatFact(config.fields[0],record.facts[config.fields[0]])}</span><button type="button" className="record-row-preview" aria-label={`Preview ${record.title}`} aria-controls="record-preview" aria-pressed={preview?.id===record.id} onClick={()=>{setSelected(record.id);if(matchMedia("(max-width: 760px)").matches)requestAnimationFrame(()=>document.getElementById("record-preview")?.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"}));}}>+</button></div>)}</div>{preview&&<aside className="record-preview" id="record-preview" aria-label="Selected record"><div className="preview-insignia"><ArchiveGlyph category={category}/><span>SELECTED RECORD / {preview.legacyId?.padStart(3,"0")??"NEW"}</span></div><ArchiveLabel type={departmentFor(category)} label={`${config.singular} dossier`}/><h3>{preview.title}</h3><span className="provenance-tag">{preview.reviewedAt?"Selected details checked":preview.reviewStatus==="legacy"?"Original collection · review pending":"Official reference added"}</span><dl className="preview-facts">{config.fields.filter(key=>preview.facts[key]).slice(0,4).map(key=><div key={key}><dt>{labelFor(key)}</dt><dd>{formatFact(key,preview.facts[key])}</dd></div>)}</dl><div className="preview-connections"><span>{preview.connectionCount}</span> recorded connections</div><Link className="archive-primary" href={recordHref(preview)} prefetch={false}>Open full record <Arrow/></Link></aside>}</div>}
    {filtered.length>0&&<div className="catalogue-pagination"><p>SHOWING {Math.min((currentPage-1)*pageSize+1,filtered.length)}—{Math.min(currentPage*pageSize,filtered.length)} OF {filtered.length}</p><div><button type="button" disabled={currentPage===1} aria-label="Previous page" onClick={()=>setPage(currentPage-1)}>←</button><span>PAGE {currentPage} / {totalPages}</span><button type="button" disabled={currentPage===totalPages} aria-label="Next page" onClick={()=>setPage(currentPage+1)}>→</button></div></div>}
    <p className="collection-footnote">{media?"Editorial cover designs are illustrative. This is a selected collection, not a complete release catalogue.":"Original collection records are preserved with their provenance. Attribute values and continuity are still being reviewed."} <Link href="/sources" prefetch={false}>Collection notes ↗</Link></p>
  </section>;
}
