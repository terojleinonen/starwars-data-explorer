"use client";
import {createContext,useContext,useMemo,useRef,useState,type ReactNode} from "react";
import Link from "next/link";
import {readLibrary,writeLibrary} from "@/lib/research-storage";
const ResearchRecords=createContext<Set<string>>(new Set());
export function ResearchIndex({ids,children}:{ids:string[];children:ReactNode}){
 const known=useMemo(()=>new Set(ids),[ids]);
 return <ResearchRecords.Provider value={known}>{children}</ResearchRecords.Provider>;
}
export default function PinMemory({record}:{record:{id:string;title:string}}){
 const known=useContext(ResearchRecords),panel=useRef<HTMLDetailsElement>(null),summary=useRef<HTMLElement>(null);
 const [boards,setBoards]=useState<{id:string;name:string}[]>([]),[target,setTarget]=useState("");
 const [busy,setBusy]=useState(false),[message,setMessage]=useState(""),[saved,setSaved]=useState(false);
 async function load(){
  setBusy(true);setMessage("");setSaved(false);
  try{const library=await readLibrary(known);setBoards(library.boards.map(({id,name})=>({id,name})));setTarget(library.activeBoardId);}
  catch{setBoards([]);setMessage("Could not open your saved desks. Your existing research is unchanged.");}
  finally{setBusy(false);}
 }
 async function pin(){
  if(busy||!target)return;
  setBusy(true);setMessage("");
  try{
   const library=await readLibrary(known),board=library.boards.find(b=>b.id===target);
   if(!board||!known.has(record.id))throw Error("Missing desk or record");
   const existing=board.cards.some(c=>c.recordId===record.id);
   if(!existing){
    if(board.cards.length>=500){setMessage("This desk has 500 cards. Choose another desk.");return;}
    const n=board.cards.length;
    board.cards.push({id:crypto.randomUUID(),recordId:record.id,x:(n%3)*330,y:Math.floor(n/3)*430});
   }
   library.activeBoardId=board.id;
   await writeLibrary(library);
   setSaved(true);setMessage(existing?`${record.title} is already on ${board.name}.`:`Added ${record.title} to ${board.name}. You can keep exploring.`);
  }catch{setMessage("Could not save this memory. Your existing research is unchanged.");}
  finally{setBusy(false);}
 }
 return <details className="pin-memory" ref={panel} onToggle={e=>{if(e.currentTarget.open)void load();}} onKeyDown={e=>{if(e.key==="Escape"){e.stopPropagation();panel.current?.removeAttribute("open");summary.current?.focus();}}}>
  <summary ref={summary}>＋ Add to research desk</summary>
  <div className="pin-memory-panel"><p>Collect <strong>{record.title}</strong> without leaving this graph.</p>
   {boards.length>0&&<><label>Research desk<select disabled={busy} value={target} onChange={e=>{setTarget(e.target.value);setSaved(false);setMessage("");}}>{boards.map(b=><option key={b.id} value={b.id}>{b.name||"Untitled desk"}</option>)}</select></label><button disabled={busy||saved} onClick={pin}>{busy?"Saving…":saved?"Memory collected ✓":"Pin this memory"}</button></>}
   {!boards.length&&busy&&<p role="status">Opening your desks…</p>}
   <p className="pin-memory-status" role="status">{message}</p>
   <Link href={saved?`/research?add=${encodeURIComponent(record.id)}`:"/research"} prefetch={false}>Open research desk ↗</Link>
  </div>
 </details>;
}
