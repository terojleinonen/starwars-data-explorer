"use client";

import React from "react";
import PageWrapper from "@/features/layout/components/PageWrapper";
import styles from "../styles/LandingPage.module.css";

import CartographyBackground from "@/features/cartography/components/CartographyBackground";
import CommandPulse from "./CommandPulse";

import AnimatedCard from "./AnimatedCard";
import AnimatedCardGrid from "./AnimatedCardGrid";
import HoloCard from "@/ui/HoloCards/components/HoloCard";

import { useTheme } from "@/theme/ThemeProvider";

const categories = [
  {
    title: "People",
    subtitle: "Individuals & factions",
    href: "/people",
    icon: "people",
  },
  {
    title: "Planets",
    subtitle: "Worlds & environments",
    href: "/planets",
    icon: "planets",
  },
  {
    title: "Starships",
    subtitle: "Interstellar vessels",
    href: "/starships",
    icon: "starships",
  },
  {
    title: "Films",
    subtitle: "Cinematic records",
    href: "/films",
    icon: "films",
  },
  {
    title: "Species",
    subtitle: "Biological classifications",
    href: "/species",
    icon: "species",
  },
  {
    title: "Vehicles",
    subtitle: "Ground & atmospheric transport",
    href: "/vehicles",
    icon: "vehicles",
  },
];

export default function LandingPage() {

  const { theme } = useTheme();

  return (
    <PageWrapper>
      <main className={styles.page}>

        {/* ================= HERO ================= */}

        <section className={styles.hero}>

          <CartographyBackground className={styles.heroBg}>
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

              <p
                id="hero-description"
                className={styles.subtitle}
              >
                Browse planets, starships, people, and factions through a
                tactical Rebel war-map in light mode — and a cinematic
                starfield in dark mode.
              </p>

              <div className={styles.microRow}>

                <div className={styles.microItem}>
                  <span className={styles.microLabel}>Mode</span>
                  <span className={styles.microValue}>
                    {theme === "dark"
                      ? "Cinematic Night Ops"
                      : "Tactical Day Map"}
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

              <div
                className={styles.panelGlow}
                aria-hidden="true"
              />

            </div>

          </div>

        </section>

        {/* ================= CATEGORY SECTION ================= */}

        <section className={styles.section}>

          <div className={styles.sectionHeader}>

            <h2 className={styles.h2}>
              Choose your category
            </h2>

            <p className={styles.p}>
              Explore the SWAPI database through holographic
              navigation modules.
            </p>

          </div>

          <AnimatedCardGrid>

            {categories.map((c) => (
              <AnimatedCard key={c.href}>
                <HoloCard
                  title={c.title}
                  subtitle={c.subtitle}
                  href={c.href}
                  icon={c.icon as any}
                />
              </AnimatedCard>
            ))}

          </AnimatedCardGrid>

        </section>

      </main>
    </PageWrapper>
  );
}