"use client";
import Link from "next/link";
import { useState } from "react";
import { editionAnchor, formatReleaseDate, recordHref, type ArchiveRecord, type EditionTimelineEvent } from "@/lib/archive/types";
import { Arrow } from "@/components/icons";

export default function ReleaseTimeline({ records, editionEvents }: { records: ArchiveRecord[]; editionEvents: EditionTimelineEvent[] }) {
  const [filter, setFilter] = useState("all");
  const filtered = records.filter(record => filter === "all" || record.category === filter);
  const events = editionEvents.filter(event => filter === "all" || event.category === filter);
  const years = [...new Set([...filtered.map(record => record.year), ...events.map(event => event.year)])].filter((year): year is number => year !== null).sort((a, b) => a - b);
  return <><div className="timeline-controls" role="group" aria-label="Timeline media type">{[["all", "All screen stories"], ["films", "Films"], ["series", "Series"]].map(([key, label]) => <button key={key} type="button" aria-pressed={filter === key} onClick={() => setFilter(key)}>{label}</button>)}<span aria-live="polite">{filtered.length} WORKS · {events.length} ADDITIONAL RELEASES</span></div>
    <div className="release-timeline">{years.map(year => <section className="timeline-year" key={year}><h2>{year}</h2><div>
      {filtered.filter(record => record.year === year).map(record => <Link key={record.id} href={recordHref(record)} prefetch={false} className={`timeline-entry timeline-${record.category}`}><span className="timeline-kind">{record.category === "films" ? "FILM" : "SERIES"}</span><h3>{record.title}</h3><span>{record.facts.collection ?? record.facts.format}</span><Arrow diagonal /></Link>)}
      {events.filter(event => event.year === year).map(event => <Link key={event.id} href={`/${event.category}/${event.slug}#${event.editionId ? editionAnchor(event.editionId) : `release-${event.id.replaceAll(":", "-")}`}`} prefetch={false} className={`timeline-entry timeline-${event.category} timeline-revision`}><span className="timeline-kind">{event.medium === "Streaming" ? "STREAMING" : event.medium === "Television" ? "TELEVISION" : event.category === "series" ? "CINEMA SCREENING" : event.editionId ? "EDIT / CONVERSION" : "CINEMA RETURN"}</span><h3>{event.title}</h3><span>{event.label} · {event.territory} · {formatReleaseDate(event.date, event.dateEnd)}</span><Arrow diagonal /></Link>)}
    </div></section>)}</div></>;
}
