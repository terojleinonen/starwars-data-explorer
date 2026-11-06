"use client";
type Mode="graph"|"compare"|"path";
const instructions={
 graph:["Choose a memory","Select a node to open its summary and connection sources.","Follow the connection","Choose “Explore from here” to move the center. Use the exploration path to go back."],
 compare:["Choose two memories","Search for two records, select each result, then choose “Compare memories”.","Inspect a shared memory","Select a shared node to see both relationships and their sources separately."],
 path:["Choose two memories","Search for two records, select each result, then choose “Find connection path”.","Inspect each link","Select the connection between two memories to see its review status and sources."]
} as const;
export function ExplorationGuide({mode}:{mode:Mode}){
 const text=instructions[mode];
 return <details className="exploration-guide"><summary>How to explore this view</summary><ol><li><strong>{text[0]}</strong><p>{text[1]}</p></li><li><strong>{text[2]}</strong><p>{text[3]}</p></li><li><strong>Return to your selection</strong><p>In the evidence panel, choose “Back to selected {mode==="path"?"link":"memory"}” or press Escape. Your view and filters stay in place.</p></li></ol></details>;
}
export function focusEvidence(panel:HTMLElement|null,mobileWidth=900){
 requestAnimationFrame(()=>{if(!panel)return;if(window.matchMedia(`(max-width:${mobileWidth}px)`).matches)panel.scrollIntoView({block:"start",behavior:window.matchMedia("(prefers-reduced-motion:reduce)").matches?"instant":"smooth"});panel.focus({preventScroll:true});});
}
export function returnToSelection(target:string,fallback:string){
 const element=document.querySelector<HTMLElement>(target)??document.querySelector<HTMLElement>(fallback);
 element?.scrollIntoView({block:"center",behavior:window.matchMedia("(prefers-reduced-motion:reduce)").matches?"instant":"smooth"});element?.focus({preventScroll:true});
}
export function EvidenceReturn({target,fallback,kind="memory",hasSelection=true}:{target:string;fallback:string;kind?:"memory"|"link";hasSelection?:boolean}){
 return <button className="exploration-return" onClick={()=>returnToSelection(target,fallback)}>← {hasSelection?`Back to selected ${kind}`:"Back to results"}<small>Esc</small></button>;
}
export function evidenceEscape(event:React.KeyboardEvent,target:string,fallback:string){if(event.key==="Escape"){event.preventDefault();event.stopPropagation();returnToSelection(target,fallback);}}
