import EvidenceLinks from "./evidence-links";
import { editionAnchor, formatReleaseDate, type FilmEdition, type FilmRelease } from "@/lib/archive/types";

type Props = { editions: FilmEdition[]; otherReleases: FilmRelease[]; sourceIndex: Map<string, number>; sectionNumber: string; isSeries?: boolean };
function Releases({ releases, sourceIndex, context }: { releases: FilmRelease[]; sourceIndex: Map<string, number>; context: string }) {
  return <ul className="edition-releases">{releases.map(release => <li key={release.id} id={`release-${release.id.replaceAll(":", "-")}`} data-status={release.status}>
    <div><strong>{formatReleaseDate(release.date, release.dateEnd)}</strong><EvidenceLinks evidence={release.evidence} index={sourceIndex} label={`${context}, ${release.date}`} /></div>
    <span>{release.status === "superseded" ? "ANNOUNCED · SUPERSEDED" : release.dateEnd ? "SCREENING WINDOW" : "RELEASED"} · {release.territory} · {release.medium}</span>
    <p className="release-event-label">{release.label}</p><p>{release.note}</p>
  </li>)}</ul>;
}
export default function FilmVersions({ editions, otherReleases, sourceIndex, sectionNumber, isSeries = false }: Props) {
  return <section id="versions" className="dossier-section">
    <div className="archive-section-heading"><p className="eyebrow">{sectionNumber} / {isSeries ? "THE SERIES THROUGH TIME" : "THE FILM THROUGH TIME"}</p><h2>Versions &amp; releases.</h2></div>
    <p className="record-context">{isSeries ? "A series can have revised episodes, compilation presentations and separate season releases. Each version below applies only to its named episode or compilation." : "A film can have several edits, conversions and release events."} Each date identifies its territory and medium. Cinema, television and streaming dates are included; physical-media releases are outside the current scope. A screening format or platform launch alone does not establish a new story edit. This is a selected, sourced history.</p>
    <div className="edition-list">{editions.map(edition => <article className="edition-entry" id={editionAnchor(edition.id)} key={edition.id}>
      <header><span className="edition-year">{edition.year}</span><div><p className="eyebrow">{edition.kind === "original" ? "ORIGINAL PRODUCTION" : "EDIT / PRESENTATION"}</p><h3>{edition.label} <EvidenceLinks evidence={edition.evidence} index={sourceIndex} label={edition.label} /></h3></div></header>
      <div className="edition-producer">{edition.credits.filter(c => c.role === "Producer" || c.role === "Special Edition producer").map(c => <p key={c.id}><span>{c.role}</span><strong>{c.person}</strong><EvidenceLinks evidence={c.evidence} index={sourceIndex} label={`${edition.label}, ${c.person}, ${c.role}`} /></p>)}</div>
      <p>{edition.summary}</p>
      {edition.releases.length ? <Releases releases={edition.releases} sourceIndex={sourceIndex} context={edition.label} /> : <p className="edition-scope">No release date has yet been verified for this specific version.</p>}
      {edition.credits.length > 0 && <details className="edition-credit-details"><summary>Selected {edition.kind === "original" ? "original-production" : "revision"} credits ({edition.credits.length})</summary><ul className="credit-list">{edition.credits.map(credit => <li key={credit.id}><div><strong>{credit.person}</strong><span>{credit.role}{credit.characterName ? ` · ${credit.characterName}` : ""}</span></div><EvidenceLinks evidence={credit.evidence} index={sourceIndex} label={`${edition.label}, ${credit.person}, ${credit.role}`} /></li>)}</ul></details>}
      <p className="edition-scope">{edition.scopeNote}</p>
    </article>)}</div>
    {otherReleases.length > 0 && <article className="edition-entry other-film-releases" id="other-releases"><header><div><p className="eyebrow">{isSeries ? "THE SERIES REACHES NEW AUDIENCES" : "THE FILM REACHES NEW AUDIENCES"}</p><h3>Other cinema, TV &amp; streaming releases</h3></div></header><p>{isSeries ? "These are programme, season or platform events, rather than alternate cuts of the whole series. The supplied episode edits and masters have not been independently identified." : "These sources establish a release or platform availability. The supplied edit or master has not been independently identified, so these events are not assigned to the original theatrical version."}</p><Releases releases={otherReleases} sourceIndex={sourceIndex} context="release history" /></article>}
  </section>;
}
