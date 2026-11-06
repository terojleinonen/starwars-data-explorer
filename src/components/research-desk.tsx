"use client";
import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import Link from "next/link";
import SavedDeskViews from "@/components/saved-desk-views";
import ResearchOverview from "@/components/research-overview";
import {centerDeskAt} from "@/lib/research-minimap";
import ArchiveGlyph from "@/components/archive/glyph";
import type { Category, Evidence } from "@/lib/archive/types";
import { createBoard, createLibrary, decodeLibrary, groupCards, removeCard, type DeskBoard, type DeskCard } from "@/lib/research-model";
import { readLibrary, writeLibrary } from "@/lib/research-storage";
export type DeskRecord = { id: string; title: string; category: Category; slug: string; summary: string };
type Edge = { id: string; from: string; to: string; relation: string; status: string; evidence: Evidence[] };
type Drag = { x: number; y: number; ox: number; oy: number; positions?: { id: string; x: number; y: number }[] };
export default function ResearchDesk({ records, edges, sources, initialRecord }: {
  records: DeskRecord[]; edges: Edge[]; sources: { id: string; title: string; url: string }[]; initialRecord?: string;
}) {
  const [library, setLibrary] = useState(createLibrary);
  const [ready, setReady] = useState(false), [persist, setPersist] = useState(false), [status, setStatus] = useState("Opening your desks…");
  const [query, setQuery] = useState(""), [selected, setSelected] = useState<string[]>([]);
  const [edgeId, setEdgeId] = useState<string | null>(null), [list, setList] = useState(false);
  const [undo, setUndo] = useState<DeskBoard[]>([]), [newName, setNewName] = useState("");
  const [groupName, setGroupName] = useState(""), [linkTarget, setLinkTarget] = useState(""), [linkLabel, setLinkLabel] = useState("");
  const [notice, setNotice] = useState("");
  const [focused,setFocused]=useState(false),[focusTools,setFocusTools]=useState(false),[focusConnections,setFocusConnections]=useState(false);
  const focusEntry=useRef<HTMLButtonElement>(null),focusExit=useRef<HTMLButtonElement>(null),focusToggle=useRef<HTMLButtonElement>(null),focusConnectionToggle=useRef<HTMLButtonElement>(null);
  const focusCenter=useRef<{x:number;y:number}|null>(null);
  const area = useRef<HTMLDivElement>(null), drag = useRef<Drag | null>(null);
  const evidence = useRef<HTMLElement>(null), latest = useRef(library);
  const knownRecords = useMemo(() => new Set(records.map(r => r.id)), [records]);
  const lookup = useMemo(() => new Map(records.map(r => [r.id, r])), [records]);
  const board = library.boards.find(b => b.id === library.activeBoardId) ?? library.boards[0];
  useEffect(() => { latest.current = library; }, [library]);
  useEffect(() => {
    let active = true;
    function loaded(saved: ReturnType<typeof createLibrary>, message: string) {
      if (!active) return;
      const target = saved.boards.find(b => b.id === saved.activeBoardId)!;
      if (initialRecord && knownRecords.has(initialRecord)) {
        let card = target.cards.find(c => c.recordId === initialRecord);
        if (!card) {
          const n = target.cards.length;
          card = { id: crypto.randomUUID(), recordId: initialRecord, x: (n % 3) * 330, y: Math.floor(n / 3) * 430 };
          target.cards.push(card);
        }
        target.view = { ...target.view, x: 60 - card.x * target.view.zoom, y: 80 - card.y * target.view.zoom };
      }
      setLibrary(saved); setStatus(message); setReady(true);
      if (initialRecord) {
        const url = new URL(window.location.href); url.searchParams.delete("add");
        window.history.replaceState(null, "", url.pathname + url.search);
      }
    }
    readLibrary(knownRecords).then(saved => { setPersist(true); loaded(saved, "Saved on this browser"); }).catch(() => loaded(createLibrary(), "Saved desks could not be opened · export changes before leaving"));
    return () => { active = false; };
  }, [initialRecord, knownRecords]);
  useEffect(() => {
    if (!ready || !persist) return;
    let active = true;
    const save = () => {
      writeLibrary(library).then(() => { if (active) setStatus("Saved on this browser"); }).catch(() => { if (active) setStatus("Could not save · export a backup"); });
    };
    const timer = drag.current ? setTimeout(save, 350) : undefined;
    if (!drag.current) save();
    return () => { active = false; clearTimeout(timer); };
  }, [library, ready, persist]);
  useEffect(() => {
    if (!ready || !persist) return;
    const save = () => { void writeLibrary(latest.current).catch(() => {}); };
    window.addEventListener("pagehide", save);
    return () => { window.removeEventListener("pagehide", save); save(); };
  }, [ready, persist]);
  useEffect(() => {
    if (edgeId) evidence.current?.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }, [edgeId]);
  function setFocusMode(next:boolean){
    const target=area.current;
    if(target)focusCenter.current={x:(target.clientWidth/2-board.view.x)/board.view.zoom,y:(target.clientHeight/2-board.view.y)/board.view.zoom};
    setFocusTools(false);setFocusConnections(false);setNotice("");setFocused(next);
  }
  useEffect(()=>{
    if(!focusCenter.current)return;
    const center=focusCenter.current;focusCenter.current=null;
    const frame=requestAnimationFrame(()=>{
      const target=area.current;if(!target)return;
      setLibrary(current=>({...current,boards:current.boards.map(b=>b.id===current.activeBoardId?{...b,view:centerDeskAt(b.view,{width:target.clientWidth,height:target.clientHeight},center)}:b)}));
      if(focused)focusExit.current?.focus();
      else focusEntry.current?.focus({preventScroll:true});
    });
    return()=>cancelAnimationFrame(frame);
  },[focused]);
  useEffect(()=>{
    if(!focused)return;
    const previous=document.body.style.overflow;document.body.style.overflow="hidden";
    return()=>{document.body.style.overflow=previous;};
  },[focused]);
  useEffect(()=>{
    if(!focused)return;
    const escape=(event:KeyboardEvent)=>{
      if(event.key!=="Escape"||event.defaultPrevented)return;
      event.preventDefault();
      if(edgeId){setEdgeId(null);return;}
      if(focusConnections){setFocusConnections(false);focusConnectionToggle.current?.focus();return;}
      if(focusTools){setFocusTools(false);focusToggle.current?.focus();return;}
      const current=latest.current,b=current.boards.find(b=>b.id===current.activeBoardId),target=area.current;
      if(b&&target)focusCenter.current={x:(target.clientWidth/2-b.view.x)/b.view.zoom,y:(target.clientHeight/2-b.view.y)/b.view.zoom};
      setFocused(false);
    };
    window.addEventListener("keydown",escape);return()=>window.removeEventListener("keydown",escape);
  },[focused,focusTools,focusConnections,edgeId]);
  function change(update: (b: DeskBoard) => DeskBoard, remember = true) {
    if (remember) setUndo(items => [...items.slice(-19), board]);
    setLibrary(current => ({ ...current, boards: current.boards.map(b => b.id === current.activeBoardId ? update(b) : b) }));
  }
  function resetSelection() { setSelected([]); setEdgeId(null); setUndo([]); setQuery(""); setGroupName(""); setLinkTarget(""); setLinkLabel(""); setNotice(""); drag.current = null; }
  function switchBoard(id: string) { resetSelection(); setLibrary(l => ({ ...l, activeBoardId: id })); }
  function selectCard(id: string, multiple = false) {
    setSelected(ids => multiple ? ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id] : [id]);
    setLinkTarget("");
  }
  function add(recordId?: string) {
    if (board.cards.length >= 500 && !board.cards.some(c => c.recordId === recordId)) { setNotice("This desk has 500 cards. Create another desk to continue."); return; }
    const existing = recordId && board.cards.find(c => c.recordId === recordId);
    if (existing) {
      setSelected([existing.id]);
      change(b => ({ ...b, view: { ...b.view, x: 70 - existing.x * b.view.zoom, y: 80 - existing.y * b.view.zoom } }), false); setQuery(""); return;
    }
    const box = area.current?.getBoundingClientRect(), n = board.cards.length % 4;
    const card: DeskCard = { id: crypto.randomUUID(), ...(recordId ? { recordId } : { note: "" }), x: ((box?.width ?? 800) / 2 - board.view.x) / board.view.zoom - 125 + n * 24, y: (100 - board.view.y) / board.view.zoom + n * 35 };
    change(b => ({ ...b, cards: [...b.cards, card] })); setSelected([card.id]); setQuery("");
  }
  function start(event: PointerEvent<HTMLElement>, ids?: string[]) {
    if (event.button !== 0 || list) return;
    event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId);
    if (ids) { setUndo(items => [...items.slice(-19), board]); setSelected(ids); }
    drag.current = { x: event.clientX, y: event.clientY, ox: board.view.x, oy: board.view.y, positions: ids ? board.cards.filter(c => ids.includes(c.id)).map(({ id, x, y }) => ({ id, x, y })) : undefined };
  }
  function moving(event: PointerEvent) {
    const d = drag.current; if (!d) return;
    const dx = event.clientX - d.x, dy = event.clientY - d.y;
    change(b => d.positions ? { ...b, cards: b.cards.map(c => { const p = d.positions!.find(p => p.id === c.id); return p ? { ...c, x: p.x + dx / b.view.zoom, y: p.y + dy / b.view.zoom } : c; }) } : { ...b, view: { ...b.view, x: d.ox + dx, y: d.oy + dy } }, false);
  }
  function moveKeys(event: React.KeyboardEvent, ids: string[]) {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    change(b => ({ ...b, cards: b.cards.map(c => ids.includes(c.id) ? { ...c, x: c.x + (event.key === "ArrowRight" ? 20 : event.key === "ArrowLeft" ? -20 : 0), y: c.y + (event.key === "ArrowDown" ? 20 : event.key === "ArrowUp" ? -20 : 0) } : c) }));
  }
  function zoom(factor: number) {
    change(b => { const z = Math.max(.1, Math.min(1.8, b.view.zoom * factor)), rect = area.current?.getBoundingClientRect(), x = (rect?.width ?? 800) / 2, y = (rect?.height ?? 600) / 2; return { ...b, view: { zoom: z, x: x - (x - b.view.x) * z / b.view.zoom, y: y - (y - b.view.y) * z / b.view.zoom } }; }, false);
  }
  function fit() {
    const box = area.current?.getBoundingClientRect(); if (!box || !board.cards.length) return;
    const minX = Math.min(...board.cards.map(c => c.x)) - 30, minY = Math.min(...board.cards.map(c => c.y)) - 65;
    const w = Math.max(...board.cards.map(c => c.x)) + 280 - minX, h = Math.max(...board.cards.map(c => c.y)) + 365 - minY;
    const z = Math.max(.1, Math.min(1, (box.width - 40) / w, (box.height - 40) / h));
    change(b => ({ ...b, view: { zoom: z, x: (box.width - w * z) / 2 - minX * z, y: (box.height - h * z) / 2 - minY * z } }), false);
  }
  function title(card?: DeskCard) { return card?.recordId ? lookup.get(card.recordId)?.title ?? "Archive record" : card?.note?.trim().slice(0, 45) || "Personal note"; }
  function exportAll() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(library, null, 2)], { type: "application/json" }));
    const a = document.createElement("a"); a.href = url; a.download = "galactic-memory-desks.json"; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const pinned = new Map(board.cards.filter(c => c.recordId).map(c => [c.recordId!, c]));
  const visibleEdges = edges.filter(e => pinned.has(e.from) && pinned.has(e.to));
  const activeEdge = visibleEdges.find(e => `archive:${e.id}` === edgeId);
  const personalEdge = board.links.find(l => `personal:${l.id}` === edgeId);
  const results = query.trim() ? records.filter(r => r.title.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 12) : [];
  const fromCard = board.cards.find(c => c.id === selected[0]);
  function path(a: DeskCard, b: DeskCard, personal = false) {
    return personal ? `M${a.x + 125},${a.y + 145} Q${(a.x + b.x) / 2 + 125},${(a.y + b.y) / 2 + 65} ${b.x + 125},${b.y + 145}` : `M${a.x + 125},${a.y + 145} L${b.x + 125},${b.y + 145}`;
  }
  function edgeButton(key: string, label: string, d: string) {
    return <path className="desk-edge-hit" role="button" tabIndex={0} aria-label={label} onClick={() => setEdgeId(key)} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setEdgeId(key); } }} d={d}/>;
  }
  return <main id="main" className={`research-desk ${focused?"is-focused":""}`}>
    {focused&&<header className="desk-focusbar"><div><span>THE RESEARCH DESK</span><strong>{board.name||"Untitled desk"}</strong></div><small role="status" title={notice||status}>{notice||status}</small><button ref={focusToggle} aria-expanded={focusTools} aria-controls="research-tools" onClick={()=>{setFocusTools(open=>!open);setFocusConnections(false);setEdgeId(null);}}>{focusTools?"Close tools":"Tools"}</button><button ref={focusConnectionToggle} aria-expanded={focusConnections} aria-controls="research-connection-index" disabled={!visibleEdges.length&&!board.links.length} onClick={()=>{setFocusConnections(open=>!open);setFocusTools(false);setEdgeId(null);}}>Connections</button><button ref={focusExit} onClick={()=>setFocusMode(false)}>Exit focus mode <span>Esc</span></button></header>}
    <header className="desk-heading"><div><p className="eyebrow">YOUR PRIVATE HOLOARCHIVE</p><h1>The research desk.</h1><p>Gather memories. Reveal connections. Leave your own traces.</p></div><div className="desk-status" role="status">{status}<small>{library.boards.length} desks · {board.cards.length} cards · {board.links.length} personal connections</small></div></header>
    <div id="research-tools" className={`desk-controls ${focusTools?"is-open":""}`} aria-label="Research tools">
    <section className="desk-library" aria-label="Your research desks">
      <label>Open desk<select disabled={!ready} value={board.id} onChange={e => switchBoard(e.target.value)}>{library.boards.map(b => <option key={b.id} value={b.id}>{b.name || "Untitled desk"} · {b.cards.length} cards</option>)}</select></label>
      <label>Desk name<input disabled={!ready} value={board.name} maxLength={80} onChange={e => change(b => ({ ...b, name: e.target.value }))} onBlur={() => { if (!board.name.trim()) change(b => ({ ...b, name: "Untitled desk" }), false); }}/></label>
      <form onSubmit={e => { e.preventDefault(); if (!newName.trim() || library.boards.length >= 100) return; const next = createBoard(crypto.randomUUID(), newName.trim()); resetSelection(); setLibrary(l => ({ ...l, activeBoardId: next.id, boards: [...l.boards, next] })); setNewName(""); }}><label className="sr-only" htmlFor="new-desk-name">New desk name</label><input id="new-desk-name" disabled={!ready} value={newName} onChange={e => setNewName(e.target.value)} placeholder="Name a new investigation…" maxLength={80}/><button disabled={!ready || !newName.trim() || library.boards.length >= 100}>＋ New desk</button></form>
    </section>
    <div className="desk-toolbar"><div className="desk-search"><label className="sr-only" htmlFor="desk-search">Find a record to add</label><input disabled={!ready} id="desk-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a memory to pin…"/>{query && <div className="desk-results">{results.length ? results.map(r => <button key={r.id} onClick={() => add(r.id)}>{r.title}<small>{r.category}{pinned.has(r.id) ? " · Already pinned" : ""}</small></button>) : <p>No matching records.</p>}</div>}</div>
      {!focused&&<button ref={focusEntry} disabled={!ready} onClick={()=>setFocusMode(true)}>Focus mode ⛶</button>}<button disabled={!ready} onClick={() => add()}>＋ Personal note</button><button disabled={!ready} onClick={() => change(b => ({ ...b, cards: b.cards.map((c, i) => ({ ...c, x: (i % 3) * 330, y: Math.floor(i / 3) * 430 })), view: { x: 40, y: 80, zoom: .85 } }))}>Arrange cards</button>
      <button onClick={() => setList(v => !v)} aria-pressed={list}>{list ? "Spatial view" : "List view"}</button><button disabled={!ready || !undo.length} onClick={() => { const previous = undo.at(-1)!; setLibrary(l => ({ ...l, boards: l.boards.map(b => b.id === previous.id ? previous : b) })); setUndo(items => items.slice(0, -1)); setSelected([]); setEdgeId(null); setNotice("Last change undone."); }}>Undo</button>
      <button disabled={!ready} onClick={exportAll}>Export all desks</button><label className="desk-import">Import desks<input disabled={!ready} type="file" accept="application/json" onChange={async e => { const input = e.currentTarget, file = input.files?.[0]; if (!file) return; try { if (file.size > 20_000_000) throw Error(); const imported = decodeLibrary(JSON.parse(await file.text()), knownRecords); if (library.boards.length + imported.boards.length > 100) throw Error(); const copies = imported.boards.map(b => ({ ...b, id: crypto.randomUUID(), name: `${b.name.slice(0, 65)} (imported)` })); resetSelection(); setLibrary(l => ({ ...l, activeBoardId: copies[0].id, boards: [...l.boards, ...copies] })); setNotice(`Imported ${copies.length} desks. Your existing desks are unchanged.`); } catch { setNotice("Could not import this file. Existing desks are unchanged."); } input.value = ""; }}/></label>
    </div>
    <SavedDeskViews key={board.id} board={board} mode={list?"list":"spatial"} ready={ready} onChange={change} onNotice={setNotice} onRestore={saved=>{drag.current=null;if(focused){setFocusTools(false);setFocusConnections(false);focusToggle.current?.focus();}change(b=>({...b,view:{...saved.view}}),false);setList(saved.mode==="list");setSelected([]);setEdgeId(null);setNotice(`Opened view “${saved.name}”.`);area.current?.scrollIntoView({block:"center",behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});}}/>
    <details className="desk-tools"><summary>Organize &amp; connect <span>{selected.length} selected · {board.groups.length} groups · {board.links.length} personal connections</span></summary>
      <form onSubmit={e => { e.preventDefault(); if (selected.length < 2 || !groupName.trim()) return; change(b => groupCards(b, selected, crypto.randomUUID(), groupName)); setGroupName(""); setNotice("Group created. Drag its header to move the cards together."); }}><span>{selected.length} selected</span><label className="sr-only" htmlFor="desk-group-name">Group name</label><input id="desk-group-name" value={groupName} onChange={e => setGroupName(e.target.value)} placeholder="Name a card group…" maxLength={80}/><button disabled={selected.length < 2 || !groupName.trim()}>Group selected</button><button type="button" disabled={!selected.length} onClick={() => setSelected([])}>Clear selection</button></form>
      <form onSubmit={e => { e.preventDefault(); if (!fromCard || !linkTarget || !linkLabel.trim() || fromCard.id === linkTarget || board.links.length >= 2000) return; const link = { id: crypto.randomUUID(), from: fromCard.id, to: linkTarget, label: linkLabel.trim() }; change(b => ({ ...b, links: [...b.links, link] })); setEdgeId(`personal:${link.id}`); setLinkTarget(""); setLinkLabel(""); }}>
        <span>Personal interpretation</span><label>From<select value={fromCard?.id ?? ""} onChange={e => { setSelected(e.target.value ? [e.target.value] : []); setLinkTarget(""); }}><option value="">Choose a card</option>{board.cards.map(c => <option key={c.id} value={c.id}>{title(c)}</option>)}</select></label><label>To<select value={linkTarget} onChange={e => setLinkTarget(e.target.value)}><option value="">Choose a card</option>{board.cards.filter(c => c.id !== fromCard?.id).map(c => <option key={c.id} value={c.id}>{title(c)}</option>)}</select></label><label className="sr-only" htmlFor="desk-link-label">Your connection label</label><input id="desk-link-label" value={linkLabel} onChange={e => setLinkLabel(e.target.value)} maxLength={160} placeholder="What might connect them?"/><button disabled={!ready || !fromCard || !linkTarget || !linkLabel.trim() || board.links.length >= 2000}>Add personal connection</button>
      </form>
    </details>
    </div>
    {notice && <p className="desk-notice" role="status">{notice}</p>}
    <p className="desk-help">Drag headers to move cards or groups. Select cards with their checkboxes. Gold: checked archive link. Lavender dots: review pending. Cyan diamonds: your interpretation.</p>
    <div className={`desk-workspace ${list ? "desk-list" : ""}`} ref={area} aria-label={`Research workspace: ${board.name}`} onPointerDown={e => { if (e.target === e.currentTarget) start(e); }} onPointerMove={moving} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
      <div className="desk-plane" style={list ? undefined : { transform: `translate(${board.view.x}px,${board.view.y}px) scale(${board.view.zoom})` }}>
        {!list && board.groups.map(g => {
          const members = board.cards.filter(c => g.cardIds.includes(c.id)); if (!members.length) return null;
          const x = Math.min(...members.map(c => c.x)) - 22, y = Math.min(...members.map(c => c.y)) - 55;
          const width = Math.max(...members.map(c => c.x)) + 272 - x, height = Math.max(...members.map(c => c.y)) + 360 - y;
          return <div key={g.id} className="desk-group" style={{ left: x, top: y, width, height }}><div className="desk-group-header"><button aria-label={`Move group ${g.name}`} onPointerDown={e => start(e, g.cardIds)} onKeyDown={e => moveKeys(e, g.cardIds)} onClick={() => setSelected(g.cardIds)}>⠿</button><label className="sr-only" htmlFor={`group-${g.id}`}>Group name: {g.name}</label><input id={`group-${g.id}`} value={g.name} maxLength={80} onChange={e => change(b => ({ ...b, groups: b.groups.map(item => item.id === g.id ? { ...item, name: e.target.value } : item) }))} onBlur={() => { if (!g.name.trim()) change(b => ({ ...b, groups: b.groups.map(item => item.id === g.id ? { ...item, name: "Untitled group" } : item) }), false); }}/><small>{g.cardIds.length} cards</small><button aria-label={`Ungroup ${g.name}`} onClick={() => change(b => ({ ...b, groups: b.groups.filter(item => item.id !== g.id) }))}>×</button></div></div>;
        })}
        <svg className="desk-edges" aria-label="Archive and personal connections">
          {!list && visibleEdges.map(e => { const a = pinned.get(e.from)!, b = pinned.get(e.to)!, d = path(a, b); return <g key={e.id} className={e.status === "verified" ? "checked" : "pending"}><path d={d}/>{edgeButton(`archive:${e.id}`, `Archive: ${lookup.get(e.from)?.title} — ${e.relation} — ${lookup.get(e.to)?.title}`, d)}</g>; })}
          {!list && board.links.map(l => { const a = board.cards.find(c => c.id === l.from)!, b = board.cards.find(c => c.id === l.to)!; return <g key={l.id} className="personal"><path d={path(a, b, true)}/>{edgeButton(`personal:${l.id}`, `Personal interpretation: ${l.label}`, path(a, b, true))}<text x={(a.x + b.x) / 2 + 125} y={(a.y + b.y) / 2 + 85} textAnchor="middle" onClick={() => setEdgeId(`personal:${l.id}`)}>◇ {l.label.length > 30 ? `${l.label.slice(0, 30)}…` : l.label}</text></g>; })}
        </svg>
        {board.cards.map(c => { const r = c.recordId ? lookup.get(c.recordId) : null, group = board.groups.find(g => g.cardIds.includes(c.id)); return <article key={c.id} className={`desk-card ${r ? "" : "desk-note"} ${selected.includes(c.id) ? "is-selected" : ""}`} style={list ? undefined : { left: c.x, top: c.y }}>
          <button className="desk-card-handle" onPointerDown={e => { if (e.shiftKey) { e.preventDefault(); return; } start(e, selected.includes(c.id) ? selected : [c.id]); }} onClick={e => { if (e.shiftKey) selectCard(c.id, true); else if (!selected.includes(c.id)) selectCard(c.id); }} onKeyDown={e => moveKeys(e, selected.includes(c.id) ? selected : [c.id])}>{r ? r.category : "PERSONAL NOTE"}<span>⠿</span></button>
          {r ? <><ArchiveGlyph category={r.category}/><h2>{r.title}</h2><p>{r.summary || "Explore this record and its documented connections."}</p><Link href={`/${r.category}/${r.slug}`}>Open archive record ↗</Link></> : <><label className="sr-only" htmlFor={`note-${c.id}`}>Personal note</label><textarea id={`note-${c.id}`} maxLength={100000} placeholder="What have you discovered?" value={c.note ?? ""} onChange={e => change(b => ({ ...b, cards: b.cards.map(x => x.id === c.id ? { ...x, note: e.target.value } : x) }))}/><small>Your interpretation · outside the archive</small></>}
          <div className="desk-card-selection"><label><input type="checkbox" checked={selected.includes(c.id)} onChange={() => selectCard(c.id, true)} aria-label={`Select ${title(c)}`}/>Select</label>{group && <span title={group.name}>{group.name}</span>}</div>
          <button className="desk-remove" aria-label={`Remove ${title(c)} from desk`} onClick={() => { change(b => removeCard(b, c.id)); setSelected(ids => ids.filter(id => id !== c.id)); setEdgeId(null); }}>×</button>
        </article>; })}
      </div>
      {ready&&!list&&<ResearchOverview board={board} selected={selected} viewport={area} onFit={fit} onCenter={(point,size)=>change(b=>({...b,view:centerDeskAt(b.view,size,point)}),false)}/>}
      {ready && !board.cards.length && <div className="desk-empty"><span>◎</span><h2>A place for your discoveries.</h2><p>Search for your first memory above, or pin a record while exploring the archive.</p><Link href="/investigate">Explore the connections ↗</Link></div>}
    </div>
    <div className="desk-bottom"><div className="desk-zoom"><button onClick={() => zoom(.8)} aria-label="Zoom out">−</button><span>{Math.round(board.view.zoom * 100)}%</span><button onClick={() => zoom(1.25)} aria-label="Zoom in">＋</button><button onClick={fit}>Fit all</button></div><p>{selected.length ? `${selected.length} selected · move together by a header or arrow keys` : "Saved locally in this browser. Export all desks for a backup."}</p></div>
    {list && board.groups.length > 0 && <section className="desk-list-groups" aria-label="Card groups">{board.groups.map(g => <div key={g.id}><strong>{g.name}</strong><span>{g.cardIds.map(id => title(board.cards.find(c => c.id === id))).join(" · ")}</span><button onClick={() => change(b => ({ ...b, groups: b.groups.filter(item => item.id !== g.id) }))}>Ungroup</button></div>)}</section>}
    {(visibleEdges.length > 0 || board.links.length > 0) && <details id="research-connection-index" className={`desk-connection-list ${focused&&focusConnections?"is-focus-open":""}`} open={focused?focusConnections:undefined} onToggle={e=>{if(focused&&!e.currentTarget.open){setFocusConnections(false);focusConnectionToggle.current?.focus();}}}><summary>Inspect {visibleEdges.length} archive connections &amp; {board.links.length} personal interpretations</summary>{visibleEdges.map(e => <button key={e.id} onClick={() => setEdgeId(`archive:${e.id}`)}>{lookup.get(e.from)?.title} ↔ {lookup.get(e.to)?.title}<small>ARCHIVE · {e.relation.replaceAll("_", " ")} · {e.status === "verified" ? "Checked" : "Review pending"}</small></button>)}{board.links.map(l => <button className="desk-personal-item" key={l.id} onClick={() => setEdgeId(`personal:${l.id}`)}>{title(board.cards.find(c => c.id === l.from))} → {title(board.cards.find(c => c.id === l.to))}<small>◇ PERSONAL INTERPRETATION · {l.label}</small></button>)}</details>}
    {(activeEdge || personalEdge) && <aside ref={evidence} className={`desk-evidence ${personalEdge ? "desk-personal-evidence" : ""}`} aria-label={personalEdge ? "Personal interpretation" : "Connection evidence"}><button onClick={() => setEdgeId(null)}>Close ×</button>
      {personalEdge ? <><p className="eyebrow">◇ PERSONAL INTERPRETATION</p><h2>{title(board.cards.find(c => c.id === personalEdge.from))} → {title(board.cards.find(c => c.id === personalEdge.to))}</h2><p>This connection is your own interpretation. It is separate from the archive and has no archive verification.</p><label>Your connection label<input value={personalEdge.label} maxLength={160} onChange={e => change(b => ({ ...b, links: b.links.map(l => l.id === personalEdge.id ? { ...l, label: e.target.value } : l) }))} onBlur={() => { if (!personalEdge.label.trim()) change(b => ({ ...b, links: b.links.map(l => l.id === personalEdge.id ? { ...l, label: "Personal interpretation" } : l) }), false); }}/></label><button onClick={() => { change(b => ({ ...b, links: b.links.filter(l => l.id !== personalEdge.id) })); setEdgeId(null); }}>Remove personal connection</button></> : activeEdge && <><p className="eyebrow">ARCHIVE / {activeEdge.status === "verified" ? "CHECKED CONNECTION" : "REVIEW PENDING"}</p><h2>{lookup.get(activeEdge.from)?.title} ↔ {lookup.get(activeEdge.to)?.title}</h2><p>Recorded relation: {activeEdge.relation.replaceAll("_", " ")}</p><p className="desk-relation-context">The pair shows an archive connection. Its direction is not inferred from the stored label; read the source context below.</p>{activeEdge.evidence.length ? activeEdge.evidence.map((e, i) => { const s = sources.find(s => s.id === e.sourceId); return <div key={i}><p>{e.note} {e.locator}</p>{s && <a href={s.url} target="_blank" rel="noreferrer">{s.title} ↗</a>}</div>; }) : <p>This recorded link has no individually checked citation.</p>}</>}
    </aside>}
  </main>;
}
