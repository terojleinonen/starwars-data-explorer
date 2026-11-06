import { ArchiveKey, departmentFor } from "@/components/archive/archive-label";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import ArchiveAtmosphere from "@/components/archive/atmosphere";
import Catalogue from "@/components/archive/catalogue";
import ArchiveGlyph from "@/components/archive/glyph";
import { categories } from "@/lib/archive/config";
import { categoryKeys, type Category } from "@/lib/archive/types";
import { getRecords } from "@/lib/archive/database";
import Link from "next/link";

type Props={params:Promise<{category:string}>};
export const dynamicParams=false;
export function generateStaticParams(){return categoryKeys.map(category=>({category}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{const{category}=await params;return {title:`${categories[category as Category]?.label??"Archive"} — The Galactic Memory`};}
export default async function CategoryPage({params}:Props){
  const{category:key}=await params;
  if(!categoryKeys.includes(key as Category))notFound();
  const category=key as Category,config=categories[category],records=getRecords(category);
  const media=category==="films"||category==="series";
  const years=records.map(record=>record.year).filter((year):year is number=>year!==null);
  return <div className={`archive-page cinematic-archive theme-${category}`} data-department={departmentFor(category)} style={{"--archive-accent":config.accent} as CSSProperties}>
    <ArchiveAtmosphere theme={category}/>
    <div className="archive-breadcrumb"><Link href="/#archive" prefetch={false}>The archive</Link><span>/</span><span>{config.label}</span><span className="breadcrumb-collection">COLLECTION {config.index}</span></div>
    <div className="collection-hero"><div><p className="eyebrow">{config.index} / {config.motif}</p><h1>{config.title.split("\n").map((line,index)=><span key={line} className={index===1?"accent-text":""}>{line}</span>)}</h1><p className="collection-description">{config.subtitle}</p></div><div className="collection-hero-art"><ArchiveGlyph category={category}/><span>{media?`${Math.min(...years)} — ${Math.max(...years)}`:"A CONNECTED COLLECTION"}</span></div></div>
    <div className="collection-stats"><p><strong>{String(records.length).padStart(2,"0")}</strong><span>{config.singular.toUpperCase()} RECORDS</span></p><p><strong>{media?"02":"06"}</strong><span>{media?"CREATIVE ERAS REPRESENTED":"ORIGINAL ARCHIVE DOMAINS"}</span></p><p className="collection-stat-note">{media?"FROM THE ORIGINAL SAGA TO NEW STORIES":"PRESERVED RECORDS. TRACEABLE ORIGINS."}</p></div>
    <ArchiveKey/>
    <Catalogue records={records} category={category}/>
  </div>;
}
