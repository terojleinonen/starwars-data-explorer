"use client";

import { useRouter } from "next/navigation";
import styles from "../styles/HoloHeader.module.css";
import type { SwapiType } from "@/lib/swapi/swapiTypes";

export type HoloHeaderSize = "md" | "lg";

type Props = {
  category?: string;
  title: string;
  subtitle?: string;
  size?: HoloHeaderSize;
  showBack?: boolean;
};

const CATEGORY_LABELS: Partial<Record<SwapiType, string>> = {
  people: "Sentient Record",
  planets: "Planetary Archive",
  films: "Holofilm Entry",
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
  const router = useRouter();


  return (
    <header
      className={`${styles.header} ${styles[size]}`}
      data-category={category}
    >
      {/* ================= MAIN HEADER ================= */}
      <div className={styles.main}>
        <h1 className={styles.title}>{title}</h1>

        {(subtitle || category) && (
          <div className={styles.meta}>
            {subtitle && (
              <span className={styles.subtitle}>
                {subtitle}
              </span>
            )}
            {category && (
              <span className={styles.category}>
                {CATEGORY_LABELS[category as SwapiType] ??
                  category.toUpperCase()}
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  );
}