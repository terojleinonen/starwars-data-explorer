"use client";

import Link from "next/link";
import styles from "./HoloHeader.module.css";
import type { SwapiType } from "@/components/types/swapi-types";

type Crumb = {
  label: string;
  href?: string;
};

type HoloHeaderProps = {
  category?: SwapiType;
  title: string;
  classification?: string;
  breadcrumbs?: Crumb[];
  showBack?: boolean;
  onBack?: () => void;
};

export default function HoloHeader({
  category,
  title,
  classification,
  breadcrumbs,
  showBack = false,
  onBack,
}: HoloHeaderProps) {
  return (
    <header
      className={styles.header}
      data-category={category}
      role="region"
      aria-label="Record header"
    >
      {/* ================= SYSTEM CONTEXT ================= */}
      {(showBack || breadcrumbs?.length) && (
        <div className={styles.systemRow}>
          {showBack && (
            <button
              type="button"
              onClick={onBack}
              className={styles.back}
              aria-label="Go back"
            >
              ←
            </button>
          )}
        </div>
      )}

      {/* ================= VIEWPORT ================= */}
      <div className={styles.viewport}>
        <h1 className={styles.title}>{title}</h1>
        {classification && (
          <div className={styles.classification}>
            {classification}
          </div>
        )}
      </div>
    </header>
  );
}