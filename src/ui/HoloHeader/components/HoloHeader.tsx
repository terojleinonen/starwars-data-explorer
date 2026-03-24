"use client";

import { useRouter } from "next/navigation";
import styles from "../styles/HoloHeader.module.css";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/features/navigation/components/Breadcrumbs";
import SystemBackArrow from "@/features/navigation/components/SystemBackArrow";
import type { SwapiType } from "@/lib/swapi/swapiTypes";

export type HoloHeaderSize = "md" | "lg";

type Props = {
  category?: string;
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
          {showBack && <SystemBackArrow onClick={handleBack} />}

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