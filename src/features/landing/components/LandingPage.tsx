"use client";

import React from "react";
import { PageWrapper } from "@/features/layout";
import { CartographyBackground } from "@/features//cartography";
import { CommandPulse, CommandTelemetry } from "@/features/landing";
import { AnimatedCard, AnimatedCardGrid } from "@/ui/motion";
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

          <CartographyBackground className={styles.heroBg}>

            {/* tactical pulse system */}
            <CommandPulse
              theme="dark"
              density="high"
              intensity="normal"
            />

          </CartographyBackground>

          {/* hero overlay */}
          <div className={styles.heroContent}>

            <div className={styles.holoPanel}>

              {/* holographic projection beam */}
              <div
                className={styles.holoProjection}
                aria-hidden="true"
              />

              {/* top meta row */}
              <div className={styles.panelTop}>

                <div className={styles.badge}>
                  <span className={styles.badgeDot} />
                  Galactic Explorer
                </div>

                <div className={styles.meta}>
                  <span className={styles.metaItem}>SWAPI</span>
                  <span className={styles.metaSep}>•</span>
                  <span className={styles.metaItem}>Cartography</span>
                  <span className={styles.metaSep}>•</span>
                  <span className={styles.metaItem}>Holo UI</span>
                </div>

              </div>

              {/* hero title */}
              <h1 className={styles.title}>
                Command-grade SWAPI
                <span className={styles.titleAccent}> Cartography</span>
              </h1>

              {/* hero description */}
              <p className={styles.subtitle}>
                Browse planets, starships, people, and factions through a
                tactical Rebel war-map in light mode — and a cinematic
                starfield in dark mode.
              </p>

              {/* system telemetry row */}
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
                  <span className={styles.microLabel}>Interface</span>
                  <span className={styles.microValue}>
                    Holographic Modules
                  </span>
                </div>
                <CommandTelemetry />
              </div>

              {/* ambient glow */}
              <div
                className={styles.panelGlow}
                aria-hidden="true"
              />

            </div>
          </div>

        </section>

        {/* =====================================================
            CATEGORY MODULES
        ===================================================== */}

        <section className={styles.section}>

          <div className={styles.sectionHeader}>

            <h2 className={styles.h2}>
              Choose your category
            </h2>

            <p className={styles.p}>
              Explore galactic records by classification.
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