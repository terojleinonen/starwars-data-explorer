"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PageWrapper } from "@/features/layout";
import styles from "../styles/LandingPage.module.css";

const sectors = [
  { key: "people", index: "01", title: "People", label: "Sentient records", count: "87", x: 20, y: 33 },
  { key: "planets", index: "02", title: "Planets", label: "Stellar cartography", count: "60", x: 68, y: 18 },
  { key: "starships", index: "03", title: "Starships", label: "Fleet registry", count: "36", x: 80, y: 55 },
  { key: "films", index: "04", title: "Films", label: "Chronology", count: "6", x: 58, y: 79 },
  { key: "species", index: "05", title: "Species", label: "Biological index", count: "37", x: 25, y: 73 },
  { key: "vehicles", index: "06", title: "Vehicles", label: "Mobility register", count: "39", x: 43, y: 48 },
] as const;

export default function LandingPage() {
  return (
    <PageWrapper wide>
      <div className={styles.root}>
        <section className={styles.hero} aria-labelledby="archive-title">
          <div className={styles.cinematicWash} aria-hidden="true" />

          <motion.div className={styles.heroCopy} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .72 }}>
            <div className={styles.overline}><span>GALACTIC INTELLIGENCE ARCHIVE</span><span>UPLINK / 7A</span></div>
            <p className={styles.kicker}>Connected evidence. Navigable history.</p>
            <h1 id="archive-title">Read the galaxy.<br/><em>Trace its connections.</em></h1>
            <p className={styles.lede}>An interactive intelligence console that turns public Star Wars data into dossiers, tactical relationships, and explorable evidence.</p>
            <div className={styles.actions}>
              <Link className={styles.primary} href="/people">Enter intelligence archive <span aria-hidden="true">→</span></Link>
              <Link className={styles.secondary} href="/planets">Open tactical map</Link>
            </div>
            <div className={styles.heroStats}>
              <span><b>265</b> indexed records</span><span><b>6</b> archive sectors</span><span><b>LIVE</b> uplink</span>
            </div>
          </motion.div>

          <motion.div className={styles.mapStage} initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: .12 }} aria-label="Interactive archive sectors">
            <div className={styles.mapPlane}>
              <span className={styles.ringA}/><span className={styles.ringB}/><span className={styles.ringC}/>
              <svg className={styles.routes} viewBox="0 0 100 100" aria-hidden="true">
                <path d="M20 33L43 48L68 18M43 48L80 55L58 79M43 48L25 73M25 73L58 79" />
                <circle cx="43" cy="48" r="2.2" />
              </svg>
              {sectors.map((sector) => (
                <Link key={sector.key} href={`/${sector.key}`} className={styles.node} data-sector={sector.key} style={{ left: `${sector.x}%`, top: `${sector.y}%` }}>
                  <i/><span>{sector.title}</span><small>{sector.count}</small>
                </Link>
              ))}
              <div className={styles.mapCore}><span>ARCHIVE</span><b>7A</b></div>
              <div className={styles.scanLine}/>
            </div>
            <div className={styles.floatingCard}>
              <span>ACTIVE SIGNAL</span><strong>Outer Rim / sector analysis</strong><small>Relationship graph synchronized</small>
            </div>
          </motion.div>
        </section>

        <section className={styles.sectors} aria-labelledby="sectors-title">
          <header className={styles.sectionHeader}>
            <div><p>Archive sectors / 01—06</p><h2 id="sectors-title">Intelligence domains</h2></div>
            <p>Each domain has its own analytical workspace, generated visual language, and connected record system.</p>
          </header>
          <div className={styles.sectorGrid}>
            {sectors.map((sector, i) => (
              <motion.div key={sector.key} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .05 }}>
                <Link className={styles.sector} data-sector={sector.key} href={`/${sector.key}`}>
                  <div className={styles.sectorTop}><span>{sector.index}</span><span>{sector.label}</span><b>{sector.count}</b></div>
                  <div className={styles.sectorGlyph}><i/><i/><i/></div>
                  <h3>{sector.title}</h3>
                  <div className={styles.sectorBottom}><span>Open domain</span><span aria-hidden="true">↗</span></div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <footer className={styles.footer}><p><span className={styles.statusDot}/> Archive uplink operational</p><p>Procedural interface · Data supplied by SWAPI</p></footer>
      </div>
    </PageWrapper>
  );
}
