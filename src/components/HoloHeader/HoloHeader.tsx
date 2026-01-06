"use client";

import styles from "./HoloHeader.module.css";
import type { SwapiType } from "@/components/types/swapi-types";

export type HoloHeaderSize = "sm" | "md" | "lg" | "xl";

export type HoloHeaderProps = {
  category?: SwapiType;
  title?: string;
  subtitle?: string;
  size?: HoloHeaderSize;
};

const SIZE_CLASS: Record<HoloHeaderSize, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
  xl: styles.xl,
};

export default function HoloHeader({
  category,
  title,
  subtitle,
  size = "lg",
}: HoloHeaderProps) {
  return (
    <header
      className={`${styles.header} ${SIZE_CLASS[size]}`}
      data-category={category}
    >
      {/* Atmospheric glow */}
      <div className={styles.glow} />

      {/* Content */}
      <div className={styles.inner}>
        {subtitle && (
          <span className={styles.subtitle}>
            {subtitle}
          </span>
        )}

        {title && (
          <h1 className={styles.title}>
            {title}
          </h1>
        )}

        {category && (
          <span className={styles.category}>
            {category.toUpperCase()}
          </span>
        )}
      </div>
    </header>
  );
}