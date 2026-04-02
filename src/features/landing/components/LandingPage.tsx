"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PageWrapper } from "@/features/layout/";
import styles from "../styles/LandingPage.module.css";

type CategoryItem = {
  key: "people" | "planets" | "starships" | "films" | "species" | "vehicles";
  title: string;
  eyebrow: string;
  desc: string;
  stats: string;
  href: string;
};

const categories: CategoryItem[] = [
  {
    key: "people",
    title: "People",
    eyebrow: "Sentient Records",
    desc: "Heroes, villains, allies, factions, and iconic galactic figures.",
    stats: "87 archived profiles",
    href: "/people",
  },
  {
    key: "planets",
    title: "Planets",
    eyebrow: "Stellar Cartography",
    desc: "Mapped worlds, climates, terrains, populations, and home systems.",
    stats: "60 navigable worlds",
    href: "/planets",
  },
  {
    key: "starships",
    title: "Starships",
    eyebrow: "Fleet Registry",
    desc: "Interstellar vessels, classes, crews, hyperdrives, and specs.",
    stats: "37 starship dossiers",
    href: "/starships",
  },
  {
    key: "films",
    title: "Films",
    eyebrow: "Holocinema",
    desc: "Episodes, release dates, directors, and narrative timeline records.",
    stats: "6 cinematic records",
    href: "/films",
  },
  {
    key: "species",
    title: "Species",
    eyebrow: "Biological Index",
    desc: "Classifications, languages, lifespans, and origin world connections.",
    stats: "37 species indexed",
    href: "/species",
  },
  {
    key: "vehicles",
    title: "Vehicles",
    eyebrow: "Surface Mobility",
    desc: "Ground and atmospheric transport, tactical craft, and utility rigs.",
    stats: "39 vehicle profiles",
    href: "/vehicles",
  },
];

const heroStats = [
  { label: "Categories", value: "6" },
  { label: "Records", value: "266+" },
  { label: "Interface", value: "Live" },
];

const archiveStatus = [
  "Navigation node stable",
  "SWAPI uplink active",
  "Holographic catalog online",
];

export default function LandingPage() {
  return (
    <PageWrapper>
      <div className={styles.root}>
        <section className={styles.hero}>
          <div className={styles.heroBackdrop} aria-hidden="true">
            <span className={styles.orbitalRing} />
            <span className={styles.orbitalRingSecondary} />
            <span className={styles.dataPulse} />
            <span className={styles.gridGlow} />
          </div>

          <div className={styles.heroInner}>
            <motion.div
              className={styles.badge}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <span className={styles.badgeDot} />
              Galactic Archive // Premium Explorer Interface
            </motion.div>

            <motion.div
              className={styles.kicker}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              STAR WARS DATA EXPLORER
            </motion.div>

            <motion.h1
              className={styles.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.58, delay: 0.14 }}
            >
              Enter the <span>Galactic Archive</span>
            </motion.h1>

            <motion.p
              className={styles.subtitle}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.58, delay: 0.2 }}
            >
              A cinematic Star Wars interface for exploring characters, worlds,
              ships, films, species, and vehicles through a premium holographic
              database experience.
            </motion.p>

            <motion.div
              className={styles.ctaRow}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.58, delay: 0.26 }}
            >
              <Link href="/people" className={styles.primaryCta}>
                <span>Initialize Archive</span>
              </Link>

              <Link href="/films" className={styles.secondaryCta}>
                Open Film Records
              </Link>
            </motion.div>

            <motion.div
              className={styles.heroStats}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.58, delay: 0.32 }}
            >
              {heroStats.map((item) => (
                <div key={item.label} className={styles.heroStatCard}>
                  <span className={styles.heroStatValue}>{item.value}</span>
                  <span className={styles.heroStatLabel}>{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className={styles.commandDeck} aria-label="Category navigation">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionEyebrow}>Command Deck</p>
              <h2 className={styles.sectionTitle}>Choose a sector to explore</h2>
            </div>

            <p className={styles.sectionSubtitle}>
              Each archive card opens a dedicated data channel with polished
              visuals and focused exploration.
            </p>
          </div>

          <div className={styles.grid}>
            {categories.map((category, index) => (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 * index }}
              >
                <Link
                  href={category.href}
                  className={`${styles.card} ${styles[category.key]}`}
                >
                  <div className={styles.cardGlow} aria-hidden="true" />
                  <div className={styles.cardSweep} aria-hidden="true" />
                  <div className={styles.cardGrid} aria-hidden="true" />

                  <div className={styles.cardTopline}>
                    <span className={styles.cardEyebrow}>{category.eyebrow}</span>
                    <span className={styles.cardArrow}>↗</span>
                  </div>

                  <div className={styles.cardInner}>
                    <h3>{category.title}</h3>
                    <p>{category.desc}</p>
                  </div>

                  <div className={styles.cardFooter}>
                    <span className={styles.cardStat}>{category.stats}</span>
                    <span className={styles.cardAction}>Open records</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <section className={styles.statusStrip} aria-label="Archive status">
          <div className={styles.statusPanel}>
            <div className={styles.statusHeader}>
              <p className={styles.sectionEyebrow}>System Status</p>

              <div className={styles.statusTitleRow}>
                <h2 className={styles.statusTitle}>Archive node online</h2>
                <span className={styles.livePill}>Live</span>
              </div>
            </div>

            <div className={styles.statusGrid}>
              {archiveStatus.map((item) => (
                <div key={item} className={styles.statusItem}>
                  <span className={styles.statusDot} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.versionPanel}>
            <span className={styles.versionLabel}>Node</span>
            <strong>Archive v1.0</strong>
            <span className={styles.versionMeta}>Consumer premium build</span>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}