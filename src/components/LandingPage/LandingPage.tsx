"use client";

import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";
import styles from "./LandingPage.module.css";

import { useCategoryTheme } from "@/hooks/useCategoryTheme";

/* =========================
   Landing Page
========================= */

export default function LandingPage() {
  /**
   * Landing page uses a neutral, inviting atmosphere.
   * We intentionally pick a real category to drive accents.
   * Starships works best visually for first impression.
   */
  useCategoryTheme("starships");

  return (
    <PageWrapper >
      <main className={styles.page}>
        {/* ================= HERO ================= */}
        <section className={styles.hero}>
          <div className={styles.heroBackdrop} />

          <div className={styles.heroContent}>
            <h1 className={styles.title}>
              Explore the Galactic Archive
            </h1>

            <p className={styles.subtitle}>
              A curated, cinematic index of people, worlds,
              vessels, and civilizations — presented as a
              modern galactic navigation console.
            </p>

            {/* ================= CATEGORIES ================= */}
            <div className={styles.categories}>
              <CategoryCard
                title="Films"
                description="Cinematic records"
                href="/films"
              />

              <CategoryCard
                title="People"
                description="Individuals & factions"
                href="/people"
              />

              <CategoryCard
                title="Planets"
                description="Worlds & environments"
                href="/planets"
              />

              <CategoryCard
                title="Starships"
                description="Interstellar vessels"
                href="/starships"
              />

              <CategoryCard
                title="Vehicles"
                description="Ground & atmospheric transport"
                href="/vehicles"
              />

              <CategoryCard
                title="Species"
                description="Biological classifications"
                href="/species"
              />
            </div>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className={styles.footer}>
          Built as a frontend systems showcase — with focus
          on UX architecture, performance, and visual polish.
        </footer>
      </main>
    </PageWrapper>
  );
}

/* =========================
   Category Card
========================= */

type CategoryCardProps = {
  title: string;
  description: string;
  href: string;
};

function CategoryCard({
  title,
  description,
  href,
}: CategoryCardProps) {
  return (
    <Link href={href} className={styles.card}>
      <div className={styles.cardSurface}>
        <span className={styles.cardTitle}>
          {title}
        </span>
        <span className={styles.cardDesc}>
          {description}
        </span>
      </div>
    </Link>
  );
}