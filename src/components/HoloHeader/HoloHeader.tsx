"use client";

import styles from "./HoloHeader.module.css";
import type { SwapiType } from "@/components/types/swapi-types";

/* =========================
   Types
========================= */

export type HoloHeaderSize = "sm" | "md" | "lg" | "xl";

export type HoloHeaderProps = {
  /** Category group (people, films, etc.) */
  category?: SwapiType;

  /** Primary title (record name / film title) */
  title?: string;

  /** Optional subtitle (director, model, etc.) */
  subtitle?: string;

  /** Optional breadcrumb-style context text */
  breadcrumb?: string;

  size?: HoloHeaderSize;
};

/* =========================
   Config
========================= */

const CATEGORY_TITLES: Partial<Record<SwapiType, string>> = {
  people: "Sentient Records",
  planets: "Planetary Archives",
  films: "Holofilm Library",
  starships: "Starship Registry",
  vehicles: "Vehicle Index",
  species: "Species Codex",
};

const SIZE_CLASS: Record<HoloHeaderSize, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
  xl: styles.xl,
};

/* =========================
   Component
========================= */

export default function HoloHeader({
  category,
  title,
  subtitle,
  breadcrumb,
  size = "lg",
}: HoloHeaderProps) {
  const displayTitle =
    title ??
    (category && CATEGORY_TITLES[category]) ??
    "Galactic Records";

  const displayCategory =
    category?.toUpperCase() ?? "ARCHIVES";

  return (
    <header className={`${styles.header} ${SIZE_CLASS[size]}`}>
      {/* Optional breadcrumb / context */}
      {breadcrumb && (
        <span className={styles.breadcrumb}>
          {breadcrumb}
        </span>
      )}

      {/* Primary title */}
      <h1 className={styles.title}>
        {displayTitle}
      </h1>

      {/* Optional subtitle (details pages) */}
      {subtitle && (
        <p className={styles.subtitle}>
          {subtitle}
        </p>
      )}

      {/* Category / group */}
      <span className={styles.category}>
        {displayCategory}
      </span>
    </header>
  );
}