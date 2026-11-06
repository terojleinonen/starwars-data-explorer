"use client";
import {useState} from "react";
import type {DeskBoard,SavedDeskView} from "@/lib/research-model";
export default function SavedDeskViews({board,mode,ready,onChange,onRestore,onNotice}:{
 board:DeskBoard;mode:SavedDeskView["mode"];ready:boolean;
 onChange:(update:(board:DeskBoard)=>DeskBoard)=>void;
 onRestore:(view:SavedDeskView)=>void;onNotice:(message:string)=>void;
}){
 const [name,setName]=useState("");
 function save(){
  if(!ready||!name.trim()||board.views.length>=50)return;
  const saved:SavedDeskView={id:crypto.randomUUID(),name:name.trim(),view:{...board.view},mode};
  onChange(b=>({...b,views:[...b.views,saved]}));setName("");onNotice(`Saved view “${saved.name}”. Its position, zoom and presentation are remembered.`);
 }
 return <details className="desk-saved-views"><summary>Saved views <span>{board.views.length} on this desk</span></summary>
  <p>Return to a place in your research. Views remember position, zoom and spatial or list presentation; your cards keep their current content and positions.</p>
  <form onSubmit={e=>{e.preventDefault();save();}}><label htmlFor="saved-view-name">Name this view<input id="saved-view-name" disabled={!ready} maxLength={80} value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. The Alderaan inquiry"/></label><span>{mode==="list"?"List presentation":`Spatial · ${Math.round(board.view.zoom*100)}%`}</span><button disabled={!ready||!name.trim()||board.views.length>=50}>Save current view</button></form>
  {board.views.length>=50&&<p>This desk has 50 saved views. Update or remove an existing view to make room.</p>}
  {board.views.length?<ul>{board.views.map(v=><li key={v.id}><label><span className="sr-only">Name for saved view {v.name}</span><input maxLength={80} value={v.name} onChange={e=>onChange(b=>({...b,views:b.views.map(item=>item.id===v.id?{...item,name:e.target.value}:item)}))} onBlur={()=>{if(!v.name.trim())onChange(b=>({...b,views:b.views.map(item=>item.id===v.id?{...item,name:"Untitled view"}:item)}));}}/></label><small>{v.mode==="list"?"List":`Spatial · ${Math.round(v.view.zoom*100)}%`}</small><button onClick={()=>onRestore(v)} aria-label={`Open saved view ${v.name}`}>Open view ↗</button><button onClick={()=>{onChange(b=>({...b,views:b.views.map(item=>item.id===v.id?{...item,view:{...b.view},mode}:item)}));onNotice(`Updated view “${v.name}” to your current position and presentation.`);}} aria-label={`Update saved view ${v.name}`}>Update</button><button onClick={()=>{onChange(b=>({...b,views:b.views.filter(item=>item.id!==v.id)}));onNotice(`Removed view “${v.name}”. Use Undo to restore it.`);}} aria-label={`Remove saved view ${v.name}`}>×</button></li>)}</ul>:<p className="desk-views-empty">Move to an interesting part of the desk, then give that view a name.</p>}
 </details>;
}
