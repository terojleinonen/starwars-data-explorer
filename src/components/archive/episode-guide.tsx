import Link from "next/link";
import EvidenceLinks from "./evidence-links";
import ArchiveLabel, { departmentFor } from "./archive-label";
import { categories } from "@/lib/archive/config";
import { recordHref, type ArchiveEpisode, type EpisodeConnection } from "@/lib/archive/types";

type Props = { episodes: ArchiveEpisode[]; sourceIndex: Map<string, number>; sectionNumber: string; countingRule: string };

function relationLabel(link: EpisodeConnection) {
  return link.relation === "setting" ? "Setting" : link.relation === "featured_ship" ? "Featured spacecraft" : "Appearance";
}
function representationLabel(link: EpisodeConnection) {
  return link.representation === "flashback" ? "Flashback" : link.representation === "transmission" ? "Transmission" : link.representation === "force_spirit" ? "Force spirit" : link.representation === "vision" ? "Vision" : link.representation === "force_communication" ? "Through the Force" : null;
}

export default function EpisodeGuide({ episodes, sourceIndex, sectionNumber, countingRule }: Props) {
  const seasons = [...new Set(episodes.map(episode => episode.season))];
  return <section id="episodes" className="dossier-section">
    <div className="archive-section-heading"><p className="eyebrow">{sectionNumber} / CHAPTER BY CHAPTER</p><h2>Episodes, in order.</h2></div>
    <p className="record-context">{countingRule}{countingRule.endsWith(".") ? "" : "."} Titles and numbering have individual sources. Writing roles and selected connections are checked separately; an omitted connection does not mean absence. Episode connections may reveal story details.</p>
    <div className="episode-seasons">{seasons.map(season => {
      const items = episodes.filter(episode => episode.season === season);
      const parts = items.reduce((count, episode) => count + episode.end - episode.start + 1, 0);
      return <details className="episode-season" key={season} open={seasons.length === 1}>
        <summary><span>Season {season}</span><small>{parts === items.length ? `${parts} episodes` : `${parts} numbered parts · ${items.length} guide entries`}</small></summary>
        <ol className="episode-list">{items.map(episode => {
          const writing = new Map<string, { role: string; line: string; evidence: typeof episode.evidence }>();
          for (const credit of episode.credits) {
            const key = `${credit.role}:${credit.creditLine}`;
            if (!writing.has(key)) writing.set(key, { role: credit.role, line: credit.creditLine, evidence: credit.evidence });
          }
          const review = episode.connectionReview;
          const reviewContent = review && <>
            <p className="episode-note">Selected profiles reviewed {review.checkedAt}. {review.scope} <EvidenceLinks evidence={review.evidence} index={sourceIndex} label={`${episode.title}, connection review`}/></p>
            {review.notes.map(note => <p className="episode-note" key={note}>{note}</p>)}
          </>;
          return <li id={`episode-s${season}e${episode.start}`} key={episode.id}>
            <div className="episode-heading"><span className="episode-number">{String(episode.start).padStart(2, "0")}{episode.end !== episode.start && `–${String(episode.end).padStart(2, "0")}`}</span><h3>{episode.title}</h3><EvidenceLinks evidence={episode.evidence} index={sourceIndex} label={`episode ${episode.title}`}/></div>
            {episode.note && <p className="episode-note">{episode.note}</p>}
            {writing.size > 0 && <dl className="episode-writing">{[...writing.values()].map(credit => <div key={credit.role + credit.line}><dt>{credit.role}</dt><dd>{credit.line} <EvidenceLinks evidence={credit.evidence} index={sourceIndex} label={`${episode.title}, ${credit.role}`}/></dd></div>)}</dl>}
            {(episode.links.length > 0 || review) && <details className="episode-connections">
              <summary>Selected episode connections ({episode.links.length})</summary>
              {review && <details className="episode-review"><summary>Review notes &amp; scope <span>Checked {review.checkedAt}</span></summary>{reviewContent}</details>}
              <ul>{episode.links.map(link => <li key={link.id} data-department={departmentFor(link.category)}>
                <div className="episode-connection-body">
                  <div className="episode-identity"><Link href={recordHref(link)} prefetch={false}>{link.title}</Link><ArchiveLabel type={departmentFor(link.category)} label={categories[link.category].singular}/></div>
                  <div className="episode-connection-meta"><span>{relationLabel(link)}</span>{representationLabel(link) && <span className="representation-label" data-representation={link.representation}>{representationLabel(link)}</span>}</div>
                  {link.note && <p className="episode-connection-note">{link.note}</p>}
                </div>
                <EvidenceLinks evidence={link.evidence} index={sourceIndex} label={`${episode.title}, ${link.title}`}/>
              </li>)}</ul>
            </details>}
          </li>;
        })}</ol>
      </details>;
    })}</div>
  </section>;
}
