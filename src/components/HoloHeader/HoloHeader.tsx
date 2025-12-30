"use client";

import styles from "./HoloHeader.module.css";
import type { SwapiType } from "@/components/types/swapi-types";

/* =========================
   Types
========================= */

export type HoloHeaderSize = "sm" | "md" | "lg" | "xl";

export type HoloHeaderProps = {
  category?: SwapiType; // ← IMPORTANT: optional
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
  breadcrumb,
  size = "lg",
}: HoloHeaderProps) {
  const title =
    (category && CATEGORY_TITLES[category]) ?? "Galactic Records";

  const categoryLabel =
    category?.toUpperCase() ?? "ARCHIVES";

  return (
    <header className={`${styles.header} ${SIZE_CLASS[size]}`}>
      {breadcrumb && (
        <span className={styles.breadcrumb}>{breadcrumb}</span>
      )}

      <h2 className={styles.title}>{title}</h2>

      <span className={styles.category}>{categoryLabel}</span>
    </header>
  );
}
