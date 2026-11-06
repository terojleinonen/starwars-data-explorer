"use client";
import {createContext,useCallback,useContext,useEffect,useState,type ReactNode} from "react";
export type MemoryStop={id:string;title:string;href:string;category:string};
const Context=createContext<{stops:MemoryStop[];remember:(stop:MemoryStop)=>void;clear:()=>void}>({stops:[],remember:()=>{},clear:()=>{}});
export const useMemoryJourney=()=>useContext(Context);
export function MemoryJourney({children}:{children:ReactNode}){
 const [stops,setStops]=useState<MemoryStop[]>([]),[ready,setReady]=useState(false);
 useEffect(()=>{let active=true;queueMicrotask(()=>{if(!active)return;try{const saved=JSON.parse(sessionStorage.getItem("memory-journey")||"[]");if(Array.isArray(saved))setStops(old=>[...saved.filter(s=>typeof s?.id==="string"&&typeof s?.title==="string"&&typeof s?.href==="string"&&s.href.startsWith("/")&&!s.href.startsWith("//")).filter(s=>!old.some(o=>o.id===s.id)),...old].slice(-8));}catch{}setReady(true);});return()=>{active=false;};},[]);
 const remember=useCallback((stop:MemoryStop)=>setStops(old=>old.at(-1)?.id===stop.id?(old.at(-1)?.href===stop.href?old:[...old.slice(0,-1),stop]):[...old.filter(s=>s.id!==stop.id),stop].slice(-8)),[]);
 useEffect(()=>{if(ready)try{sessionStorage.setItem("memory-journey",JSON.stringify(stops));}catch{}},[stops,ready]);
 return <Context.Provider value={{stops,remember,clear:()=>setStops([])}}>{children}</Context.Provider>;
}
export function RememberMemory({record}:{record:MemoryStop}){const {remember}=useMemoryJourney();const {id,title,href,category}=record;useEffect(()=>{remember({id,title,href,category});},[remember,id,title,href,category]);return null;}
