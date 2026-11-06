"use client";
import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from "react";
export type MemoryLens="holocron"|"jedi"|"imperial";
export const lensInfo={holocron:{label:"Holocron",name:"Holocron knowledge",description:"Follow the constellation. Discover how memories connect."},jedi:{label:"Jedi",name:"Jedi archives",description:"Read the lives, stories, and legacies behind the record."},imperial:{label:"Imperial",name:"Imperial records",description:"Inspect the registry. Worlds, craft, and documented roles."}};
const Context=createContext<{lens:MemoryLens;mode:"dark"|"light";settings:ReactNode}>({lens:"holocron",mode:"dark",settings:null});
export const useMemoryLens=()=>useContext(Context);
export function memoryPriority(category:string,lens:MemoryLens){const order=lens==="jedi"?["people","films","series","species","planets","starships","vehicles"]:lens==="imperial"?["starships","vehicles","planets","people","species","films","series"]:[];return order.length?order.indexOf(category):0;}
export function MemoryPreferences({children}:{children:ReactNode}) {
 const [lens,setLens]=useState<MemoryLens>("holocron"),[mode,setMode]=useState<"dark"|"light">("dark"),[ready,setReady]=useState(false),[type,setType]=useState<"cinematic"|"archive">("cinematic");
 useEffect(()=>{let active=true;queueMicrotask(()=>{if(!active)return;try{const saved=JSON.parse(localStorage.getItem("galactic-memory-view")||"{}");if(["holocron","jedi","imperial"].includes(saved.lens))setLens(saved.lens);if(["dark","light"].includes(saved.mode))setMode(saved.mode);if(["cinematic","archive"].includes(saved.type))setType(saved.type);}catch{}setReady(true);});return()=>{active=false;};},[]);
 useEffect(()=>{if(!ready)return;document.documentElement.dataset.memoryLens=lens;document.documentElement.dataset.memoryMode=mode;document.documentElement.dataset.memoryType=type;if(ready)try{localStorage.setItem("galactic-memory-view",JSON.stringify({lens,mode,type}));}catch{}},[lens,mode,type,ready]);
 const settings=<div className="memory-switchboard"><div className="memory-lens-picker" role="group" aria-label="Archive perspective"><span className="memory-switch-label">READ THROUGH</span>{(["holocron","jedi","imperial"] as MemoryLens[]).map(l=><button key={l} aria-pressed={lens===l} onClick={()=>setLens(l)}>{lensInfo[l].label}</button>)}</div><p className="memory-perspective-note">{lensInfo[lens].description}</p><label className="memory-type-picker"><span>Titles</span><select aria-label="Heading style" value={type} onChange={e=>setType(e.target.value as "cinematic"|"archive")}><option value="cinematic">Cinematic</option><option value="archive">Classic</option></select></label><div className="memory-mode-picker" role="group" aria-label="Display theme"><button aria-pressed={mode==="dark"} onClick={()=>setMode("dark")}>◐ Dark</button><button aria-pressed={mode==="light"} onClick={()=>setMode("light")}>☼ Light</button></div></div>;
 return <Context.Provider value={{lens,mode,settings}}>{children}</Context.Provider>;
}

export function MemorySettings(){
 const {settings,lens}=useContext(Context); const ref=useRef<HTMLDetailsElement>(null);
 return <details ref={ref} name="archive-navigation" className="memory-settings" onKeyDown={e=>{if(e.key==="Escape"){e.stopPropagation();ref.current?.removeAttribute("open");ref.current?.querySelector("summary")?.focus();}}}><summary aria-label="Archive appearance settings"><span aria-hidden="true">◇</span><span>Archive settings<small>{lensInfo[lens].label}</small></span></summary><section aria-label="Archive appearance"><p className="index-kicker">THE ARCHIVE / APPEARANCE</p><h2>Choose your perspective.</h2><p className="settings-intro">One collection. Three ways to read it.</p>{settings}</section></details>;
}
