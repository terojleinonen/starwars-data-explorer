"use client";

import styles from "./HoloHeader.module.css";
import type { SwapiType } from "@/components/types/swapi-types";

export type HoloHeaderSize = "sm" | "md" | "lg";

type Props = {
  category?: SwapiType;
  title?: string;
  subtitle?: string;
  size?: HoloHeaderSize;
};

const CATEGORY_LABELS: Partial<Record<SwapiType, string>> = {
  people: "Sentient Records",
  planets: "Planetary Archives",
  films: "Holofilm Library",
  starships: "Starship Registry",
  vehicles: "Vehicle Index",
  species: "Species Codex",
};

export default function HoloHeader({
  category,
  title,
  subtitle,
  size = "lg",
}: Props) {
  return (
    <header
      className={`${styles.header} ${styles[size]}`}
      data-category={category}
    >
      {/* atmospheric glow layer */}
      <div className={styles.glow} aria-hidden />

      <div className={styles.inner}>
        {category && (
          <span className={styles.eyebrow}>
            {CATEGORY_LABELS[category] ?? "Galactic Records"}
          </span>
        )}

        {title && (
          <h1 className={styles.title}>
            {title}
          </h1>
        )}

        {subtitle && (
          <p className={styles.subtitle}>
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}