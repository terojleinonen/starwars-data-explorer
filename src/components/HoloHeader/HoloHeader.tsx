"use client";

import styles from "./HoloHeader.module.css";
import type { SwapiType } from "@/components/types/swapi-types";

/* =========================
   Types
========================= */

export type HoloHeaderSize = "sm" | "md" | "lg";

export type HoloHeaderProps = {
  /** Primary page anchor (REQUIRED for category pages) */
  title: string;

  /** Secondary contextual label (optional) */
  subtitle?: string;

  /** Used only for atmosphere + metadata */
  category?: SwapiType;

  /** Explicit visual hierarchy */
  size?: HoloHeaderSize;
};

/* =========================
   Component
========================= */

export default function HoloHeader({
  title,
  subtitle,
  category,
  size = "md",
}: HoloHeaderProps) {
  return (
    <header
      className={`${styles.header} ${styles[size]}`}
      data-category={category}
    >
      {/* Content */}
      <div className={styles.inner}>
        
        <h1 className={styles.title}>
          {title}
        </h1>

        {subtitle && (
          <span className={styles.subtitle}>
            {subtitle}
          </span>
        )}


      </div>
    </header>
  );
}