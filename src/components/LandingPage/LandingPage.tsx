"use client";

import Link from "next/link";
import styles from "./LandingPage.module.css";

import { useCategoryTheme } from "@/hooks/useCategoryTheme";

/* =========================
   Landing Page
========================= */

export default function LandingPage() {
  // neutral accent for landing
  useCategoryTheme("starships"); // blue-tech feel

  return (
    <main className={`${styles.page} landing-hero`}>
      {/* ================= HERO ================= */}
      <section className={styles.hero}>
        <div className={styles.heroBackdrop} />

        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Explore the Galactic Archive
          </h1>

          <p className={styles.subtitle}>
            A cinematic, interactive index of people,
            worlds, vessels and civilizations —
            presented as a modern data console.
          </p>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className={styles.categories}>
        <CategoryCard
          title="Films"
          description="Cinematic records"
          href="/films"
        />
        
        <CategoryCard
          title="People"
          description="Individuals and factions"
          href="/people"
        />

        <CategoryCard
          title="Planets"
          description="Worlds and environments"
          href="/planets"
        />

        <CategoryCard
          title="Starships"
          description="Interstellar vessels"
          href="/starships"
        />

        <CategoryCard
          title="Vehicles"
          description="Atmospheric & ground transport"
          href="/vehicles"
        />

        <CategoryCard
          title="Species"
          description="Biological classifications"
          href="/species"
        />
      </section>

      {/* ================= FOOTER ================= */}
      <footer className={styles.footer}>
        <p>
          Built as a frontend systems showcase —
          focus on UX, performance, and interaction design.
        </p>
      </footer>
    </main>
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