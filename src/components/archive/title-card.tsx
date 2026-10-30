import type { CSSProperties } from "react";
import type { ArchiveRecord } from "@/lib/archive/types";
import { romanEpisode } from "@/lib/archive/config";
import type { TitleCardDesign } from "@/lib/archive/title-card-designs";
export { titleCardDesign } from "@/lib/archive/title-card-designs";

/** Every work has authored geometry; no external media or repeated poster artwork. */
function Motif({ design }: { design: TitleCardDesign }) {
  return <svg className="title-card-art" viewBox="0 0 240 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    {design.motifs.map((shape, index) => shape.tag === "path"
      ? <path key={index} className={shape.className} d={shape.d}/>
      : <circle key={index} className={shape.className} cx={shape.cx} cy={shape.cy} r={shape.r}/>)}
  </svg>;
}

export default function TitleCard({ record, design }: { record: ArchiveRecord; design: TitleCardDesign }) {
  const credit = record.facts.director || record.facts.creator || record.facts.format;
  const creditLabel = record.facts.director ? "DIRECTOR" : record.facts.creator ? "CREATOR" : "FORMAT";
  const format = record.category === "films" ? (record.facts.episode_id ? `FILM / ${romanEpisode(record.facts.episode_id)}` : "FILM") : "SERIES";
  const style = {
    "--title-accent": design.accent,
    "--title-paper": design.paper,
    "--title-surface": design.surface,
    "--title-glow": design.glow ?? "radial-gradient(ellipse at 71% 26%, color-mix(in srgb, var(--title-accent) 14%, transparent), transparent 40%)",
    "--title-type-min": `${design.typography[0]}px`,
    "--title-type-scale": `${design.typography[1]}cqw`,
    "--title-type-max": `${design.typography[2]}px`,
  } as CSSProperties;
  return <div className={`record-cover title-card title-card--${design.id}`} style={style} data-title-design={design.id} aria-hidden="true">
    <Motif design={design}/>
    <div className="title-card-header"><span>{format}</span><span>{record.year}</span></div>
    <div className="title-card-body">
      <span className="title-card-index">{record.facts.collection || record.facts.format}</span>
      <span className="title-card-name">{design.lines.map((line, index) => <span key={index} className={line.kind ? `title-card-${line.kind}` : undefined}>{line.text}</span>)}</span>
    </div>
    <div className="title-card-credit"><span>{creditLabel}</span><strong>{credit}</strong><span className="title-card-open">↗</span></div>
  </div>;
}
