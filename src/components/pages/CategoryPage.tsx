"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import HoloHeader from "@/components/HoloHeader/HoloHeader";
import RecordGrid from "@/components/records/RecordGrid";

import { useSwapi } from "@/components/useSwapi";
import type { SwapiType } from "@/components/types/swapi-types";
import type {
  SwapiItem,
  SwapiListResponse,
} from "@/components/useSwapi";

import styles from "./CategoryPage.module.css";

/* =========================
   Types
========================= */

type Props = {
  category: SwapiType;
  title: string;
  subtitle: string;
};

/* =========================
   Component
========================= */

export default function CategoryPage({
  category,
  title,
  subtitle,
}: Props) {
  const {
    data,
    loading,
    error,
  } = useSwapi<SwapiListResponse<SwapiItem>>(
    category
  );

  const items = data?.results ?? [];

  return (
    <PageWrapper atmosphere={category}>
      <section className={styles.page}>
        {/* ================= HEADER ================= */}
        <div className={styles.header}>
          <HoloHeader
            title={title}
            subtitle={subtitle}
            size="md"
          />
        </div>

        {/* ================= STATES ================= */}
        {loading && (
          <p className={styles.status}>
            Loading records…
          </p>
        )}

        {error && (
          <p className={styles.error}>
            Transmission error: {error}
          </p>
        )}

        {/* ================= GRID ================= */}
        {!loading && !error && (
          <RecordGrid
            items={items}
            category={category}
          />
        )}
      </section>
    </PageWrapper>
  );
}