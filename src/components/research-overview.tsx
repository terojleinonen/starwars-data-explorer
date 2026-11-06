"use client";
import {useEffect,useId,useRef,useState,type PointerEvent,type RefObject} from "react";
import type {DeskBoard} from "@/lib/research-model";
import {researchMapBounds,visibleDeskArea,type MapBounds,type MapSize} from "@/lib/research-minimap";
export default function ResearchOverview({board,selected,viewport,onCenter,onFit}:{
 board:DeskBoard;selected:string[];viewport:RefObject<HTMLDivElement|null>;
 onCenter:(point:{x:number;y:number},size:MapSize)=>void;onFit:()=>void;
}){
 const [size,setSize]=useState<MapSize>({width:0,height:0}),[open,setOpen]=useState(true),[lockedBounds,setLockedBounds]=useState<MapBounds|null>(null);
 const gesture=useRef<{bounds:MapBounds;rect:{left:number;top:number;width:number;height:number}}|null>(null);
 const help=useId();
 useEffect(()=>{
  const target=viewport.current;if(!target)return;
  const update=()=>setSize({width:target.clientWidth,height:target.clientHeight});
  update();const observer=new ResizeObserver(update);observer.observe(target);return()=>observer.disconnect();
 },[viewport]);
 if(!size.width||!size.height||!board.cards.length)return null;
 const bounds=lockedBounds??researchMapBounds(board.cards,board.view,size),visible=visibleDeskArea(board.view,size);
 function point(event:PointerEvent<SVGSVGElement>){
  const frame=gesture.current;if(!frame)return;
  const u=Math.max(0,Math.min(1,(event.clientX-frame.rect.left)/frame.rect.width)),v=Math.max(0,Math.min(1,(event.clientY-frame.rect.top)/frame.rect.height));
  onCenter({x:frame.bounds.x+u*frame.bounds.width,y:frame.bounds.y+v*frame.bounds.height},size);
 }
 return <aside className={`desk-overview ${open?"":"is-collapsed"}`} aria-label="Research desk overview" onPointerDown={e=>e.stopPropagation()} onPointerMove={e=>e.stopPropagation()} onPointerUp={e=>e.stopPropagation()}>
  <div className="desk-overview-heading"><button aria-expanded={open} onClick={()=>setOpen(v=>!v)}>Overview <span aria-hidden="true">{open?"−":"＋"}</span></button>{open&&<button onClick={onFit} aria-label="Fit entire research desk">Fit desk</button>}</div>
  {open&&<><svg viewBox={`${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`} preserveAspectRatio="none" role="button" tabIndex={0} aria-label="Navigate research overview" aria-describedby={help}
   onPointerDown={e=>{e.preventDefault();e.stopPropagation();if(e.button!==0)return;const r=e.currentTarget.getBoundingClientRect();setLockedBounds(bounds);gesture.current={bounds,rect:{left:r.left,top:r.top,width:r.width,height:r.height}};e.currentTarget.setPointerCapture(e.pointerId);e.currentTarget.focus();point(e);}}
   onPointerMove={e=>{e.stopPropagation();if(gesture.current)point(e);}} onPointerUp={e=>{e.stopPropagation();gesture.current=null;setLockedBounds(null);}} onPointerCancel={()=>{gesture.current=null;setLockedBounds(null);}}
   onKeyDown={e=>{
    const step=e.shiftKey?.4:.15,center={x:visible.x+visible.width/2,y:visible.y+visible.height/2};
    if(e.key==="ArrowLeft")center.x-=visible.width*step;
    else if(e.key==="ArrowRight")center.x+=visible.width*step;
    else if(e.key==="ArrowUp")center.y-=visible.height*step;
    else if(e.key==="ArrowDown")center.y+=visible.height*step;
    else if(e.key==="Enter"||e.key===" "){e.preventDefault();onFit();return;}
    else return;
    e.preventDefault();onCenter(center,size);
   }}>
   {board.groups.map(g=>{const cards=board.cards.filter(c=>g.cardIds.includes(c.id));if(!cards.length)return null;const x=Math.min(...cards.map(c=>c.x))-22,y=Math.min(...cards.map(c=>c.y))-55;return <rect className="overview-group" key={g.id} x={x} y={y} width={Math.max(...cards.map(c=>c.x))+272-x} height={Math.max(...cards.map(c=>c.y))+360-y}/>;})}
   {board.cards.map(c=><rect key={c.id} className={`overview-card ${c.recordId?"":"overview-note"} ${selected.includes(c.id)?"overview-selected":""}`} x={c.x} y={c.y} width={250} height={340}/>)}
   <rect className="overview-viewport" x={visible.x} y={visible.y} width={visible.width} height={visible.height}/>
  </svg><p id={help}>Click or drag to navigate.<span className="sr-only"> Arrow keys move the view. Hold Shift to move faster. Enter fits the entire desk.</span></p></>}
 </aside>;
}
