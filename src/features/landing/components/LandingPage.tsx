"use client";

import React from "react";

import { PageWrapper } from "@/features/layout/";
import { AnimatedCard, AnimatedCardGrid} from "@/ui/motion";
import { HoloCard } from "@/ui/HoloCards";
import styles from "../styles/LandingPage.module.css";

export default function LandingPage() {

  return (
    <PageWrapper>
      <main className={styles.page}>
        {/* =====================================================
           HERO SECTION
        ===================================================== */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.holoPanel}>
              <div className={styles.panelTop}>
                <div className={styles.badge}>
                  <span className={styles.badgeDot} />
                  Galactic Explorer
                </div>
                <div className={styles.meta}>
                  <span>SWAPI</span>
                  <span className={styles.metaSep}>•</span>
                  <span>Cartography</span>
                  <span className={styles.metaSep}>•</span>
                  <span>Holo UI</span>
                </div>
              </div>
              <h1 className={styles.title}>
                Command-grade SWAPI
                <span className={styles.titleAccent}> Cartography</span>
              </h1>
              <p className={styles.subtitle}>
                Browse planets, starships, people, and factions through a tactical
                Rebel war-map in light mode — and a cinematic starfield in dark mode.
              </p>
              <div className={styles.microRow}>
                <div className={styles.microItem}>
                  <span className={styles.microLabel}>Mode</span>
                  <span className={styles.microValue}>
                    Cinematic Night Ops
                  </span>
                </div>
                <div className={styles.microItem}>
                  <span className={styles.microLabel}>Latency</span>
                  <span className={styles.microValue}>
                    Optimized Prefetch
                  </span>
                </div>
                <div className={styles.microItem}>
                  <span className={styles.microLabel}>UI</span>
                  <span className={styles.microValue}>
                    Holographic Cards
                  </span>
                </div>
              </div>
              <div className={styles.panelGlow} />
            </div>
          </div>
        </section>
        {/* =====================================================
           CATEGORY SECTION
        ===================================================== */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.h2}>Choose your category</h2>
            <p className={styles.p}>
              Explore records from the Galactic Archive.
            </p>
          </div>
          <AnimatedCardGrid>
            <AnimatedCard>
              <HoloCard
                title="People"
                subtitle="Individuals & factions"
                href="/people"
                icon="people"
              />
            </AnimatedCard>
            <AnimatedCard>
              <HoloCard
                title="Planets"
                subtitle="Worlds & environments"
                href="/planets"
                icon="planets"
              />
            </AnimatedCard>
            <AnimatedCard>
              <HoloCard
                title="Starships"
                subtitle="Interstellar vessels"
                href="/starships"
                icon="starships"
              />
            </AnimatedCard>
            <AnimatedCard>
              <HoloCard
                title="Films"
                subtitle="Cinematic records"
                href="/films"
                icon="films"
              />
            </AnimatedCard>
            <AnimatedCard>
              <HoloCard
                title="Species"
                subtitle="Biological classifications"
                href="/species"
                icon="species"
              />
            </AnimatedCard>
            <AnimatedCard>
              <HoloCard
                title="Vehicles"
                subtitle="Ground & atmospheric transport"
                href="/vehicles"
                icon="vehicles"
              />
            </AnimatedCard>
          </AnimatedCardGrid>
        </section>
      </main>
    </PageWrapper>
  );
}