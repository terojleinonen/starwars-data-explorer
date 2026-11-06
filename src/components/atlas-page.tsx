import {getRelated} from "@/lib/archive/database";
import { getAtlasData } from "@/lib/archive/atlas-data";
import GalacticAtlas from "@/components/galactic-atlas";
import "@/app/atlas.css";
export default function AtlasPage({mode,world,record,returnTo}:{mode:"history"|"galaxy"|"war";world?:string;record?:string;returnTo?:string}){
 const data=getAtlasData(),contextRecord=mode==="history"?data.records.find(r=>r.id===record):undefined;
 const context=contextRecord?{record:contextRecord,workIds:(contextRecord.category==="films"||contextRecord.category==="series")?[contextRecord.id]:getRelated(contextRecord.id).filter(r=>(r.category==="films"||r.category==="series")&&r.reviewStatus==="verified").map(r=>r.id)}:undefined;
 const safeReturn=returnTo&&returnTo.length<16000&&/^\/(films|series|people|planets|starships|vehicles|species)\/[a-z0-9-]+(?:[?#]|$)/.test(returnTo)?returnTo:undefined;
 return <GalacticAtlas key={`${mode}-${world??record??"default"}`} initialMode={mode} initialWorld={world} initialFilm={record} data={data} context={context} returnTo={safeReturn}/>;
}
