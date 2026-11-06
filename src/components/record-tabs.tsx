"use client";
import {useMemoryJourney,type MemoryStop} from "@/components/memory-journey";
import {useEffect,useRef,useState,type ReactNode} from "react";
const names=["connections","details","sources"] as const;type Tab=typeof names[number];
function tabForHash(hash:string):Tab{if(hash.startsWith("source-")||hash==="references"||hash==="record-sources")return "sources";if(["attributes","versions","credits","episodes","record-details"].some(x=>hash.startsWith(x)))return "details";return "connections";}
function reveal(element:HTMLElement,source=false){
 requestAnimationFrame(()=>requestAnimationFrame(()=>{
  if(!element.isConnected)return;
  const header=document.querySelector('.journey-header')?.getBoundingClientRect().height??0;
  const toolbar=source?document.querySelector('.source-return-toolbar')?.getBoundingClientRect().height??0:0;
  const top=element.getBoundingClientRect().top+window.scrollY-header-toolbar-20;
  if(!element.matches('a,button,input,select,textarea,[tabindex]'))element.tabIndex=-1;
  element.focus({preventScroll:true});window.scrollTo({top:Math.max(0,top),behavior:"instant"});
 }));
}
export default function RecordTabs({connections,details,sources,connectionCount,sourceCount,record}:{connections:ReactNode;details:ReactNode;sources:ReactNode;connectionCount:number;sourceCount:number;record:MemoryStop}){
 const {remember}=useMemoryJourney();
 const [tab,setTab]=useState<Tab>("connections"),[canReturn,setCanReturn]=useState(false);const refs=useRef<(HTMLButtonElement|null)[]>([]);
 const citation=useRef<{element:HTMLAnchorElement;tab:Tab;hash:string}|null>(null);const currentTab=useRef<Tab>(tab);
 useEffect(()=>{currentTab.current=tab;},[tab]);
 useEffect(()=>{
  function sync(){let hash="";try{hash=decodeURIComponent(location.hash.slice(1));}catch{return;}setTab(tabForHash(hash));if(hash){const element=document.getElementById(hash);if(element)reveal(element,tabForHash(hash)==="sources");}}
  function capture(event:MouseEvent){if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;const anchor=(event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#source-"]');if(!anchor)return;citation.current={element:anchor,tab:currentTab.current,hash:location.hash};setCanReturn(true);setTab("sources");}
  sync();window.addEventListener("hashchange",sync);document.addEventListener("click",capture,true);return()=>{window.removeEventListener("hashchange",sync);document.removeEventListener("click",capture,true);};
 },[]);
 function select(next:Tab){setTab(next);remember({...record,href:`${record.href}#record-${next}`});history.replaceState(history.state,"",`#record-${next}`);}
 function returnToPassage(){const previous=citation.current;if(previous?.element.isConnected){setTab(previous.tab);history.replaceState(history.state,"",location.pathname+location.search+previous.hash);setCanReturn(false);reveal(previous.element);}else{select("connections");if(refs.current[0])reveal(refs.current[0]);}}
 return <div className="record-tabs" onClickCapture={e=>{const a=(e.target as HTMLElement).closest("a");const href=a?.getAttribute("href");if(href?.startsWith("#")){setTab(tabForHash(href.slice(1)));}}}><div className="record-tablist" role="tablist" aria-label="Record workspace">{names.map((name,i)=><button ref={el=>{refs.current[i]=el;}} key={name} id={`record-tab-${name}`} role="tab" aria-selected={tab===name} aria-controls={`record-${name}`} tabIndex={tab===name?0:-1} onClick={()=>select(name)} onKeyDown={e=>{let n=i;if(e.key==="ArrowRight")n=(i+1)%3;else if(e.key==="ArrowLeft")n=(i+2)%3;else if(e.key==="Home")n=0;else if(e.key==="End")n=2;else return;e.preventDefault();select(names[n]);refs.current[n]?.focus();}}>{name==="connections"?"Connections":name==="details"?"Recorded details":"Sources"}{name!=="details"&&<span>{name==="connections"?connectionCount:sourceCount}</span>}</button>)}</div><section role="tabpanel" id="record-connections" aria-labelledby="record-tab-connections" hidden={tab!=="connections"}>{connections}</section><section role="tabpanel" id="record-details" aria-labelledby="record-tab-details" hidden={tab!=="details"}>{details}</section><section role="tabpanel" id="record-sources" aria-labelledby="record-tab-sources" hidden={tab!=="sources"}><div className="source-return-toolbar"><span>SOURCE EVIDENCE</span><button onClick={returnToPassage}>{canReturn?"← Back to cited passage":"← Back to record"}</button></div>{sources}</section></div>;
}
