"use client";

import { useRouter } from "next/navigation";
import styles from "./HoloHeader.module.css";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/navigation/Breadcrumbs";
import type { SwapiType } from "@/components/types/swapi-types";

export type HoloHeaderSize = "md" | "lg";

type Props = {
  category?: SwapiType;
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
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
  breadcrumbs,
  size = "lg",
  showBack = true,
}: Props) {
  const router = useRouter();

  function handleBack() {
    router.back();
  }

  return (
    <header
      className={`${styles.header} ${styles[size]}`}
      data-category={category}
    >
      {/* ================= SYSTEM CONTEXT ROW ================= */}
      {(showBack || breadcrumbs) && (
        <div className={styles.context}>
          {showBack && (
            <button
              type="button"
              onClick={handleBack}
              aria-label="Go back"
              className={styles.back}
            >
              <span className={styles.backIcon}>←</span>
              <span className={styles.backLabel}>Back</span>
            </button>
          )}

          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumbs items={breadcrumbs} />
          )}
        </div>
      )}

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
                {CATEGORY_LABELS[category] ??
                  category.toUpperCase()}
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  );
}