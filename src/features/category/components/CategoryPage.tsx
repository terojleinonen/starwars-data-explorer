"use client";

import { useSwapi } from "@/hooks/data/useSwapi";
import { useRecordQuery } from "@/hooks/data/useRecordQuery";
import type { SwapiType, SwapiItem } from "@/lib/swapi/types";
import type { SwapiListResponse } from "@/hooks/data/useSwapi";
import { useRegisterNavigation } from "@/features/navigation";
import { PageWrapper } from "@/features/layout";
import { HoloHeader } from "@/ui/HoloHeader";
import { CategoryToolbar } from "@/features/category";
import { RecordGrid } from "@/features/records";
import styles from "../styles/CategoryPage.module.css";

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