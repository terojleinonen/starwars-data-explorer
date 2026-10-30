import { ArchiveKey } from "@/components/archive/archive-label";
import ArchiveAtmosphere from "@/components/archive/atmosphere";
import Link from "next/link";
import type { Metadata } from "next";
import { getRecords, getEditionTimelineEvents } from "@/lib/archive/database";
import ReleaseTimeline from "@/components/archive/timeline";

export const metadata:Metadata={title:"Release Timeline — Star Wars Universe"};
export default function TimelinePage(){return <div className="archive-page cinematic-archive timeline-page"><ArchiveAtmosphere theme="archive"/><div className="archive-breadcrumb"><Link href="/#archive" prefetch={false}>The archive</Link><span>/</span><span>Release timeline</span></div><div className="collection-hero"><div><p className="eyebrow">08 / THROUGH THE YEARS</p><h1><span>A GALAXY,</span><span className="accent-text">IN THE MAKING.</span></h1><p className="collection-description">The films and series in this collection, with original releases and selected cinema, television and streaming events.</p></div><div className="timeline-hero-year" aria-hidden="true">1977<br/><span>↓</span><br/>2026</div></div><p className="timeline-context">Release history follows our world’s calendar. It is distinct from the fictional BBY / ABY timeline and from a recommended viewing order.</p><ArchiveKey/><ReleaseTimeline editionEvents={getEditionTimelineEvents()} records={[...getRecords("films"),...getRecords("series")]}/></div>;}
