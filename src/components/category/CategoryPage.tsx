"use client";

import styles from "./CategoryPage.module.css";
import HoloHeader from "@/components/HoloHeader/HoloHeader";
import CategoryCard from "@/components/category/CategoryCard";
import { useSwapi } from "@/hooks/useSwapi";
import type { SwapiType } from "@/components/types/swapi-types";

/* =========================
   Types
========================= */

type SwapiItem = {
  name?: string;
  title?: string;
  url: string;
  [key: string]: unknown;
};

type Props = {
  category: SwapiType;
};

/* =========================
   Helpers
========================= */

function getIdFromUrl(url: string): string {
  return url.split("/").filter(Boolean).pop()!;
}

function getTitle(item: SwapiItem): string {
  return item.name ?? item.title ?? "Unknown";
}

function getSecondary(item: SwapiItem): string | undefined {
  return (
    (item.model as string) ??
    (item.starship_class as string) ??
    (item.climate as string) ??
    (item.director as string) ??
    (item.classification as string) ??
    undefined
  );
}

/* =========================
   Component
========================= */

export default function CategoryPage({
  category,
}: Props) {
  // ✅ CORRECT: no response generic
  const { data, loading, error } = useSwapi(
    category,
    "1"
  );

  // ✅ Safe narrowing
  const items: SwapiItem[] =
    data && "results" in data && Array.isArray(data.results)
      ? data.results
      : [];

  return (
    <main className={styles.page}>
      {/* ===== Header ===== */}
      <HoloHeader category={category} />

      {/* ===== States ===== */}
      {loading && (
        <p className={styles.status}>
          Loading records…
        </p>
      )}

      {error && (
        <p className={styles.error}>
          Transmission error.
        </p>
      )}

      {/* ===== Card Grid ===== */}
      {!loading && !error && (
        <section className={styles.grid}>
          {items.map((item) => {
            const id = getIdFromUrl(item.url);
            const title = getTitle(item);
            const secondary =
              getSecondary(item);

            return (
              <CategoryCard
                key={id}
                href={`/${category}/${id}`}
                id={id}
                title={title}
                secondary={secondary}
              />
            );
          })}
        </section>
      )}
    </main>
  );
}