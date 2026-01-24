"use client";

import { useSwapi } from "@/hooks/useSwapi";
import { useRecordQuery } from "@/hooks/useRecordQuery";
import type { SwapiType, SwapiItem } from "@/components/types/swapi-types";
import type { SwapiListResponse } from "@/hooks/useSwapi";
import { useRegisterNavigation } from "../navigation/useRegisterNavigation";
import PageWrapper from "@/components/layout/PageWrapper";
import HoloHeader from "@/components/HoloHeader/HoloHeader";
import CategoryToolbar from "@/components/category/CategoryToolbar";
import RecordGrid from "@/components/records/RecordGrid";
import styles from "./CategoryPage.module.css";
import Breadcrumbs from "../navigation/Breadcrumbs";
import SystemBack from "../navigation/SystemBack";
import { use, useEffect } from "react";

/* -----------------------------------------------
   Types
----------------------------------------------- */

type CategoryPageProps = {
  category: SwapiType;
  title: string;
  subtitle: string;
  loadingText: string;
};

/* -----------------------------------------------
   Component
----------------------------------------------- */

export default function CategoryPage({
  category,
  title,
  subtitle,
  loadingText,
}: CategoryPageProps) {

  const { data, loading, error } = useSwapi<SwapiListResponse<SwapiItem>>(category);
  const items: SwapiItem[] = data?.results ?? [];
  const {
    results,
    query,
    setQuery,
    sortKey,
    setSortKey,
  } = useRecordQuery(items);

  useRegisterNavigation({
    label: category.charAt(0).toUpperCase() + category.slice(1),
    href: `/${category}`,
  });

  return (
    <PageWrapper category={category}>
      {/* ================= HEADER ================= */}
      <div className={styles.header}>
        <HoloHeader 
          category={category} 
          title={title} 
          subtitle={subtitle}
          showBack={false}
        />
      </div>

      {/* ================= TOOLBAR ================= */}
      {!loading && !error && (
        <CategoryToolbar
          query={query}
          onQueryChange={setQuery}
          sortKey={sortKey}
          onSortChange={setSortKey}
        />
      )}

      {/* ================= STATES ================= */}
      {loading && (
        <p className={styles.loading}>{loadingText}</p>
      )}

      {error && (
        <p className={styles.error}>
          Transmission error: {error}
        </p>
      )}

      {!loading && !error && (
        <>
          {results.length === 0 ? (
            <p className={styles.empty}>
              No records match your query.
            </p>
          ) : (
            <RecordGrid
              items={results}
              category={category}
            />
          )}
        </>
      )}
    </PageWrapper>
  );
}