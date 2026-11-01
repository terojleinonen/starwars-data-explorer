import Link from "next/link";
import HomeLink from "@/components/home-link";
import HomeArchive from "@/components/home-archive";
import "./home.css";
import EraExplorer from "@/components/era-explorer";
import MotionControl from "@/components/motion-control";
import { Arrow, OrbitMark } from "@/components/icons";

const chapters = [
  { number: "01", label: "The archive", href: "#archive" },
  { number: "02", label: "Two creative eras", href: "#legacies" },
  { number: "03", label: "Our approach", href: "#approach" },
];

export default function HomePage() {
  return (
    <>
      <header className="site-header">
        <HomeLink className="wordmark" aria-label="Star Wars Universe home">
          <OrbitMark /><span><span className="wordmark-top">STAR WARS</span><span className="wordmark-bottom">UNIVERSE</span></span>
        </HomeLink>
      </header>

      <main id="main">
        <section className="hero" id="prologue" aria-labelledby="hero-title">
          <picture className="hero-image">
            <source type="image/avif" srcSet="/images/galaxy-800.avif 800w, /images/galaxy-1200.avif 1200w, /images/galaxy-1672.avif 1672w" sizes="100vw" />
            <source type="image/webp" srcSet="/images/galaxy-800.webp 800w, /images/galaxy-1200.webp 1200w, /images/galaxy-1672.webp 1672w" sizes="100vw" />
            {/* A native picture preserves our pre-encoded variants without a runtime image service. */}
            <img src="/images/galaxy-1200.webp" alt="" width="1672" height="941" fetchPriority="high" decoding="async" />
          </picture>
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-frame" aria-hidden="true"><span /><span /><span /><span /></div>
          <div className="hero-content content-width">
            <p className="eyebrow hero-eyebrow"><span className="tiny-star" aria-hidden="true">✦</span> A LONG TIME AGO. A STORY STILL UNFOLDING.</p>
            <h1 id="hero-title">A GALAXY<br /><span>OF STORIES.</span></h1>
            <p className="hero-description">From George Lucas’s original vision to new horizons.<br className="desktop-break" /> Discover the people, worlds, and connections<br className="desktop-break" /> that make a universe.</p>
            <Link className="primary-link" href="/films" prefetch={false}>Enter Archive<Arrow /></Link>
          </div>
          <div className="hero-side-note" aria-hidden="true"><span className="coordinate-cross">+</span><span>BEYOND THE FAMILIAR<br />THERE IS ALWAYS MORE.</span></div>
          <div className="hero-bottom content-width">
            <a className="scroll-cue" href="#archive"><span className="scroll-track" aria-hidden="true"><i /></span> Scroll to discover</a>
            <p className="hero-edition">PROLOGUE <span>/</span> 001</p>
            <MotionControl />
          </div>
        </section>

        <div className="chapter-nav-wrap">
          <nav className="chapter-nav content-width" aria-label="Page chapters">
            {chapters.map((chapter) => <a key={chapter.number} href={chapter.href}><span>{chapter.number}</span>{chapter.label}<Arrow diagonal /></a>)}
          </nav>
        </div>

        <HomeArchive />

        <section className="legacies-section content-width" id="legacies" aria-labelledby="legacies-title">
          <div className="section-label"><span>02 / TWO CREATIVE ERAS</span><span className="section-rule" /></div>
          <div className="section-heading"><h2 id="legacies-title">THE SAME STARS.<br /><span>NEW HORIZONS.</span></h2><p>A founding vision. Generations of new voices.<br />Explore the creative eras behind the universe.</p></div>
          <EraExplorer />
        </section>

        <section className="approach-section" id="approach" aria-labelledby="approach-title">
          <div className="content-width">
            <div className="section-label"><span>03 / OUR APPROACH</span><span className="section-rule" /></div>
            <div className="approach-layout">
              <div className="approach-title"><OrbitMark /><h2 id="approach-title">A LITTLE WONDER.<br /><span>A CLEAR SOURCE.</span></h2><p>The ambition is cinematic.<br />The foundation is evidence.</p></div>
              <ol className="principles">
                <li><span>01</span><div><h3>Follow the source.</h3><p>Follow each record back to its origin, and see which facts still need review. A growing archive built around traceable public sources.</p></div></li>
                <li><span>02</span><div><h3>Know which story you’re in.</h3><p>Canon and Legends stay distinct. Creative eras, publication dates, and in-universe history each have their place.</p></div></li>
                <li><span>03</span><div><h3>Built to keep exploring.</h3><p>A collection under our own care. Original illustration, considered design, and a fast, quiet reading experience.</p></div></li>
              </ol>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer content-width">
        <div className="footer-top"><HomeLink className="wordmark" aria-label="Star Wars Universe home"><OrbitMark /><span><span className="wordmark-top">STAR WARS</span><span className="wordmark-bottom">UNIVERSE</span></span></HomeLink><a className="back-top" href="#prologue">Back to the stars <span>↑</span></a></div>
        <div className="footer-bottom"><p>An independent fan project. Not affiliated with Lucasfilm or Disney.<br />Star Wars and related names belong to their respective rights holders.</p><p>FIRST LOOK / 2026<br />Original illustrative artwork · Archive in development</p></div>
      </footer>
    </>
  );
}
