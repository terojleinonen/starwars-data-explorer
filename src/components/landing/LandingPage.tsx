"use client"
import PageWrapper from "../layout/PageWrapper";
import React from "react";
import styles from "./LandingPage.module.css";
import CartographyBackground from "../background/CartographyBackground";
import CommandPulse from "../landing/CommandPulse";
import AnimatedCard from "../landing/AnimatedCard";
import AnimatedCardGrid from "../landing/AnimatedCardGrid";
import HoloCard from "../cards/HoloCard";

export default function LandingPage() {
  const [theme, setTheme] = React.useState<"dark" | "light">("dark");
  
  return (
      <PageWrapper>
        <main className={styles.page}>
      <section className={styles.hero}>
        <CartographyBackground theme={theme} className={styles.heroBg}>
          <CommandPulse
            theme={theme}
            density={theme === "dark" ? "high" : "medium"}
            intensity={theme === "dark" ? "normal" : "subtle"}
          />
        </CartographyBackground>

        <div className={styles.heroContent}>
          <div className={styles.holoPanel}>
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

            <h1 className={styles.title}>
              Command-grade SWAPI
              <span className={styles.titleAccent}> Cartography</span>
            </h1>

            <p className={styles.subtitle}>
              Browse planets, starships, people, and factions through a tactical Rebel war-map in light mode —
              and a cinematic starfield in dark mode.
            </p>

            <div className={styles.microRow}>
              <div className={styles.microItem}>
                <span className={styles.microLabel}>Mode</span>
                <span className={styles.microValue}>{theme === "dark" ? "Cinematic Night Ops" : "Tactical Day Map"}</span>
              </div>
              <div className={styles.microItem}>
                <span className={styles.microLabel}>Latency</span>
                <span className={styles.microValue}>Optimized Prefetch</span>
              </div>
              <div className={styles.microItem}>
                <span className={styles.microLabel}>UI</span>
                <span className={styles.microValue}>Holographic Cards</span>
              </div>
            </div>

            <div className={styles.panelGlow} aria-hidden="true" />
          </div>
        </div>
      </section>
      {/* Next section placeholder: your holo card grid */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.h2}>Choose your category</h2>
          <div className={styles.p}>
            <AnimatedCardGrid>
              <AnimatedCard>
                <HoloCard title="People" subtitle="Individuals & factions" href="/people" icon="people"/>
              </AnimatedCard>

              <AnimatedCard>
                <HoloCard title="Planets" subtitle="Worlds & environments" href="/planets" icon="planets"/>
              </AnimatedCard>

              <AnimatedCard>
                <HoloCard title="Starships" subtitle="Interstellar vessels" href="/starships" icon="starships"/>
              </AnimatedCard>

              <AnimatedCard>
                <HoloCard title="Films" subtitle="Cinematic records" href="/films" icon="films"/>
              </AnimatedCard>

              <AnimatedCard>
                <HoloCard title="Species" subtitle="Biological classifications" href="/species" icon="species"/>
              </AnimatedCard>

              <AnimatedCard>
                <HoloCard title="Vehicles" subtitle="Ground & atmospheric transport" href="/vehicles" icon="vehicles"/>
              </AnimatedCard>
            </AnimatedCardGrid>
          </div>
        </div>

        <div className={styles.cardGridPlaceholder} aria-hidden="true" />
      </section>
    </main>
      </PageWrapper>
  );
}