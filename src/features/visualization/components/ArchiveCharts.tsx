import { Surface } from "@/ui";
import { categoryVisualizations, completeness, type Datum, type Point } from "@/lib/visualization/visualization";
import styles from "../styles/ArchiveCharts.module.css";

function compact(value: number) { return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value); }

function Bars({ data, unit }: { data: Datum[]; unit?: string }) {
  const max = Math.max(1, ...data.map((item) => item.value));
  return <div className={styles.bars}>{data.map((item) => <div className={styles.barRow} key={item.label}>
    <div className={styles.barLabel}><span>{item.label}</span><strong>{compact(item.value)}{unit ? ` ${unit}` : ""}</strong></div>
    <div className={styles.track}><i style={{ width: `${Math.max(2, item.value / max * 100)}%` }} /></div>
  </div>)}</div>;
}

function Scatter({ data, xLabel, yLabel }: { data: Point[]; xLabel: string; yLabel: string }) {
  const maxX = Math.max(1, ...data.map((p) => p.x)); const maxY = Math.max(1, ...data.map((p) => p.y));
  return <div className={styles.scatterWrap}>
    <span className={styles.yLabel}>{yLabel}</span>
    <svg className={styles.scatter} viewBox="0 0 640 300" role="img" aria-label={`${xLabel} compared with ${yLabel}`}>
      {[1,2,3,4].map((n) => <g key={n}><line x1="40" y1={20+n*52} x2="620" y2={20+n*52} className={styles.gridLine}/><line x1={40+n*116} y1="20" x2={40+n*116} y2="280" className={styles.gridLine}/></g>)}
      {data.map((p) => <circle key={`${p.label}-${p.x}-${p.y}`} cx={40+(p.x/maxX)*570} cy={280-(p.y/maxY)*250} r="5" className={styles.point}><title>{p.label}: {xLabel} {compact(p.x)}, {yLabel} {compact(p.y)}</title></circle>)}
    </svg><span className={styles.xLabel}>{xLabel}</span>
  </div>;
}

function ChartCard({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return <Surface material="glass" elevation={1} padding="md" className={styles.card}><p className={styles.eyebrow}>{eyebrow}</p><h3>{title}</h3>{children}</Surface>;
}

export function RecordSignature({ category, seed }: { category: string; seed: string }) {
  const sum = [...seed].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rings = [38 + sum % 13, 61 + sum % 17, 86 + sum % 11];
  return <svg viewBox="0 0 240 240" className={styles.signature} aria-label={`${category} archive signature`}>
    <circle cx="120" cy="120" r="108" className={styles.signatureFrame}/>
    {rings.map((r, i) => <circle key={r} cx="120" cy="120" r={r} className={styles.signatureRing} strokeDasharray={`${7+i*4} ${5+i*3}`} />)}
    <path d={`M30 ${80+sum%55} L210 ${145-sum%40} M${70+sum%35} 30 L${155-sum%25} 210`} className={styles.signatureAxis}/>
    <circle cx={78+sum%72} cy={72+(sum*3)%96} r="7" className={styles.signatureCore}/><text x="120" y="226" textAnchor="middle">{category.toUpperCase()} · {String(sum).slice(-4).padStart(4,"0")}</text>
  </svg>;
}

export default function ArchiveCharts({ category, records, selectedName }: { category: string; records: unknown[]; selectedName?: string }) {
  const visual = categoryVisualizations(category, records); const quality = completeness(records);
  return <div className={styles.dashboard}>
    <div className={styles.primaryGrid}>
      <ChartCard eyebrow="Composition" title={visual.distributionTitle}>{visual.distribution.length ? <Bars data={visual.distribution}/> : <p className={styles.noData}>No categorical data available.</p>}</ChartCard>
      <ChartCard eyebrow="Ranked comparison" title={visual.rankingTitle}>{visual.ranking.length ? <Bars data={visual.ranking} unit={visual.rankingUnit}/> : <p className={styles.noData}>No ranked numeric data available.</p>}</ChartCard>
    </div>
    <div className={styles.secondaryGrid}>
      <ChartCard eyebrow="Correlation field" title={visual.scatterTitle}>{visual.scatter.length ? <Scatter data={visual.scatter} xLabel={visual.xLabel} yLabel={visual.yLabel}/> : <p className={styles.noData}>Not enough paired numeric records.</p>}</ChartCard>
      <ChartCard eyebrow="Record identity" title={selectedName ?? "Active archive set"}><RecordSignature category={category} seed={selectedName ?? `${category}-${records.length}`}/></ChartCard>
    </div>
    <ChartCard eyebrow="Data provenance" title="Field completeness"><Bars data={quality} unit="%"/></ChartCard>
  </div>;
}
