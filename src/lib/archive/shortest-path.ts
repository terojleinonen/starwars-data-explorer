/** Unweighted breadth-first search. The caller controls which recorded edges are allowed. */
export function shortestPath(start:string,end:string,neighbors:(id:string)=>Iterable<string>):string[]|null{
 if(start===end)return[start];
 const parents=new Map<string,string|null>([[start,null]]),queue=[start];
 for(let head=0;head<queue.length;head++){
  const current=queue[head];
  for(const next of neighbors(current)){
   if(parents.has(next))continue;
   parents.set(next,current);
   if(next===end){const path=[end];let previous=parents.get(end);while(previous!==null&&previous!==undefined){path.push(previous);previous=parents.get(previous);}return path.reverse();}
   queue.push(next);
  }
 }
 return null;
}
