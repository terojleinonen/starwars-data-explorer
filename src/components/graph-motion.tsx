"use client";
import {ViewTransition,useTransition,type ReactElement} from "react";

/** Names preserve record identity when a neighbor becomes the center (and back). */
export function graphMemoryName(graph:"record"|"archive",id:string){
 return `${graph}-memory-${Array.from(id,c=>c.codePointAt(0)!.toString(16)).join("-")}`;
}
export function GraphMemoryTransition({graph,id,children}:{graph:"record"|"archive";id:string;children:ReactElement}){
 return <ViewTransition name={graphMemoryName(graph,id)} default="none" share="memory-node-move" enter="memory-node-enter" exit="memory-node-exit">{children}</ViewTransition>;
}
export function GraphLinksTransition({graph,center,children}:{graph:"record"|"archive";center:string;children:ReactElement}){
 return <ViewTransition key={center} name={`${graph}-graph-links`} default="none" share="memory-links" enter="memory-links" exit="memory-links">{children}</ViewTransition>;
}
export function useGraphMotion(){
 const [pending,startTransition]=useTransition();
 function move(update:()=>void){
  // Synchronous updates bypass React's view transitions entirely in these cases.
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches||typeof document.startViewTransition!=="function")update();
  else startTransition(update);
 }
 return {move,pending};
}
