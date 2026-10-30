import Link from "next/link";
import type { CSSProperties } from "react";
import { Arrow } from "@/components/icons";
import { ArchiveKey } from "@/components/archive/archive-label";
import ArchiveGlyph from "@/components/archive/glyph";
import { getRecord, getStats } from "@/lib/archive/database";
import { categories } from "@/lib/archive/config";
import { categoryKeys, recordHref } from "@/lib/archive/types";

/** The former overview, rendered with the prologue as one server-rendered page. */
export default function HomeArchive() {
  const stats = getStats();
  const film = getRecord("films", "a-new-hope")!;
  const series = getRecord("series", "andor")!;

  return (
    <section className="home-archive content-width" id="archive" aria-labelledby="archive-title">
      <span id="universe" className="home-archive-anchor" aria-hidden="true" />
      <div className="section-label"><span>01 / THE COLLECTION</span><span className="section-rule" /></div>
      <div className="home-archive-intro">
        <h2 id="archive-title">ONE GALAXY.<br /><span>MANY WAYS IN.</span></h2>
        <div><p>Begin with a film. Follow a character.<br />Find the world beyond the frame.</p><p>An independent archive of the stories, people, worlds, and craft that connect a universe. Choose your own point of departure.</p></div>
      </div>
      <dl className="home-archive-stats" aria-label="The collection in numbers">
        <div><dt>Archive records</dt><dd>{stats.total.toLocaleString("en-US")}</dd></div>
        <div><dt>Films &amp; series</dt><dd>{stats.counts.films + stats.counts.series}</dd></div>
        <div><dt>Connected collections</dt><dd>{categoryKeys.length}</dd></div>
        <div><dt>Recorded links</dt><dd>{stats.connections.toLocaleString("en-US")}</dd></div>
      </dl>
      <ArchiveKey />

      <section className="home-archive-section" aria-labelledby="home-featured-title">
        <div className="home-section-heading"><div><p className="eyebrow">A PLACE TO BEGIN</p><h3 id="home-featured-title">From the screen, outward.</h3></div><Link href="/timeline" prefetch={false}>See the release timeline <Arrow diagonal /></Link></div>
        <div className="featured-works">
          <Link href={recordHref(film)} className="featured-work feature-film" prefetch={false}>
            <div className="feature-top"><span>THE ORIGINAL SAGA</span><span>1977 / EPISODE IV</span></div>
            <div><span className="feature-kicker">A FILM BY GEORGE LUCAS</span><h4>A NEW<br />HOPE.</h4><p>The first release. A lasting point of departure.</p><span className="feature-bottom">OPEN FILM RECORD <Arrow /></span></div>
            <div className="feature-orbit" aria-hidden="true" />
          </Link>
          <Link href={recordHref(series)} className="featured-work feature-series" prefetch={false}>
            <div className="feature-top"><span>NEW PERSPECTIVES</span><span>2022 / SERIES</span></div>
            <div><span className="feature-kicker">CREATED BY TONY GILROY</span><h4>ANDOR.</h4><p>The rebellion, seen from the ground.</p><span className="feature-bottom">OPEN SERIES RECORD <Arrow /></span></div>
            <div className="feature-lines" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="home-archive-section" aria-labelledby="home-collections-title">
        <div className="home-section-heading"><div><p className="eyebrow">FOLLOW YOUR CURIOSITY</p><h3 id="home-collections-title">Choose a collection.</h3></div><span className="home-index-note">SEVEN COLLECTIONS / ONE UNIVERSE</span></div>
        <div className="collection-directory">
          {categoryKeys.map(key => <Link key={key} href={`/${key}`} prefetch={false} style={{ "--collection-accent": categories[key].accent } as CSSProperties}>
            <div className="directory-top"><span>{categories[key].index} / {categories[key].motif}</span><Arrow diagonal /></div>
            <ArchiveGlyph category={key} />
            <div className="directory-bottom"><h4>{categories[key].label}</h4><span>{String(stats.counts[key]).padStart(2, "0")}</span></div>
          </Link>)}
        </div>
      </section>

      <section className="home-archive-origin" aria-labelledby="home-origin-title">
        <div><p className="eyebrow">A COLLECTION WITH A MEMORY</p><h3 id="home-origin-title">Built on what came before.</h3><p>{stats.legacy} records from the original website are preserved alongside {stats.editorial} source-led additions. Each checked detail has a traceable reference; inherited facts and incomplete records remain visibly under review.</p></div>
        <Link href="/sources" prefetch={false}>Trace the collection <Arrow diagonal /></Link>
      </section>
    </section>
  );
}
