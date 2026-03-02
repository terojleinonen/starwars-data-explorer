"use client";

import { PageWrapper } from "@/features/layout";
import { CartographyBackground }from "@/features//cartography";
import { CategoryToolbar } from "@/features/category";
import { RecordGrid } from "@/features/records";
import type { SwapiType, SwapiItem, SwapiListResponse} from "@/lib/swapi/swapiTypes";
import { useSwapi } from "@/hooks/data/useSwapi";
import { useRecordQuery } from "@/hooks/data/useRecordQuery";
import styles from "../styles/CategoryPage.module.css";

type Props = {
  category: SwapiType;
  title: string;
  subtitle: string;
  records: SwapiItem[];
};

export default function CategoryPage({
  category,
  title,
  subtitle,
  records,
}: Props) {
 
  /* =====================================================
     SEARCH / SORT STATE
  ===================================================== */

  const { data, loading, error } = useSwapi<SwapiListResponse<SwapiItem>>(category);
  const items: SwapiItem[] = data?.results ?? [];
  const {
    results,
    query,
    setQuery,
    sortKey,
    setSortKey,
  } = useRecordQuery(items);

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <PageWrapper>

      <main className={styles.page}>

        {/* CARTOGRAPHY BACKGROUND */}

        <CartographyBackground />

        {/* =====================================================
           CATEGORY HEADER
        ===================================================== */}
        <section className={styles.bannerWrapper}>

          <div className={styles.categoryBanner}>

            <div className={styles.categoryBadge}>
              Galactic Archive
            </div>

            <h1 className={styles.categoryTitle}>
              {title}
            </h1>

            <p className={styles.categorySubtitle}>
              {subtitle}
            </p>

          </div>

        </section>

        {/* =====================================================
           SEARCH + SORT TOOLBAR
        ===================================================== */}

        <section className={styles.toolbarWrapper}>

          {!loading && !error && (
            <CategoryToolbar
              query={query}
              onQueryChange={setQuery}
              sortKey={sortKey}
              onSortChange={setSortKey}
            />
          )}

        </section>

        {/* =====================================================
           RECORD CONSOLE
        ===================================================== */}

        <section className={styles.recordConsole}>
          {!loading && !error && (
        <>
          {results.length === 0 ? (
            <p className={styles.empty}>
              No records match your query.
            </p>
          ) : (
            <RecordGrid
              records={results}
              category={category}
            />
          )}
        </>
      )}

        </section>

      </main>

    </PageWrapper>
  );
}