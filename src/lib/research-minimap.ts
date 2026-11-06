import type {DeskCard,DeskBoard} from "./research-model";
export type MapSize={width:number;height:number};
export type MapBounds={x:number;y:number;width:number;height:number};
export function visibleDeskArea(view:DeskBoard["view"],size:MapSize):MapBounds{
 return {x:-view.x/view.zoom,y:-view.y/view.zoom,width:size.width/view.zoom,height:size.height/view.zoom};
}
export function researchMapBounds(cards:DeskCard[],view:DeskBoard["view"],size:MapSize):MapBounds{
 const visible=visibleDeskArea(view,size);
 let left=Math.min(visible.x,...cards.map(c=>c.x-24)),top=Math.min(visible.y,...cards.map(c=>c.y-55));
 let right=Math.max(visible.x+visible.width,...cards.map(c=>c.x+274)),bottom=Math.max(visible.y+visible.height,...cards.map(c=>c.y+365));
 const padding=Math.max(60,(right-left)*.06,(bottom-top)*.06);
 left-=padding;top-=padding;right+=padding;bottom+=padding;
 const width=right-left,height=bottom-top,ratio=200/128;
 if(width/height>ratio){const extra=width/ratio-height;top-=extra/2;bottom+=extra/2;}
 else{const extra=height*ratio-width;left-=extra/2;right+=extra/2;}
 return{x:left,y:top,width:right-left,height:bottom-top};
}
export function centerDeskAt(view:DeskBoard["view"],size:MapSize,point:{x:number;y:number}):DeskBoard["view"]{
 return {zoom:view.zoom,x:size.width/2-point.x*view.zoom,y:size.height/2-point.y*view.zoom};
}
