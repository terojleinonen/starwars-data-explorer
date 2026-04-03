"use client";

import { useEffect, useMemo, useState } from "react";
import { PageWrapper } from "@/features/layout";
import { RecordGrid } from "@/features/records";
import { HoloHeader } from "@/ui/HoloHeader";
import { useSwapi } from "@/hooks/data/useSwapi";
import { SwapiType } from "@/lib/swapi/swapiTypes";
import { setNavContext } from "@/lib/navigation/navigationContext";
import styles from "@/features/category/styles/CategoryPage.module.css";
import { ContentContainer } from "@/features/layout";

type Props = {
  category: SwapiType;
  loadingText: string;
};

const CategoryPage = ({ category, loadingText }: Props) => {
  const { data, loading, error } = useSwapi(category);
  const [search, setSearch] = useState("");
  
  const items = data?.results ?? [];

  // Filter items based on search query
  const filtered = useMemo(() => {
    return items.filter((item) => {
      const label = (item.name || item.title || "").toLowerCase();
      return label.includes(search.toLowerCase());
    });
  }, [items, search]);

  // ✅ IMPORTANT: enables "Back to context"
  useEffect(() => {
    setNavContext(category, `/${category}`);
  }, [category]);

  return (
    <PageWrapper>
      <ContentContainer >
      <HoloHeader category={category} title={category.toUpperCase()} showBack={false} />

      {/* SEARCH BAR */}
      <div className={styles.toolbar}>
        <input
          type="text"
          placeholder="Search records..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.search}
        />
      </div>

      {loading && <p className={styles.loading}>{loadingText}</p>}
      {error && <p className={styles.error}>Transmission error</p>}

      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <p className={styles.empty}>No records found</p>
          ) : (
            <RecordGrid
              records={filtered}
              category={category}
            />
          )}
        </>
      )}
      </ContentContainer>
    </PageWrapper>
  );
};

/* ========================= */
/* CATEGORY EXPORTS */
/* ========================= */

export const FilmsPage = () => (
  <CategoryPage
    category="films"
    loadingText="Loading films..."
  />
);

export const PeoplePage = () => (
  <CategoryPage
    category="people"
    loadingText="Loading people..."
  />
);

export const PlanetsPage = () => (
  <CategoryPage
    category="planets"
    loadingText="Loading planets..."
  />
);

export const SpeciesPage = () => (
  <CategoryPage
    category="species"
    loadingText="Loading species..."
  />
);

export const VehiclesPage = () => (
  <CategoryPage
    category="vehicles"
    loadingText="Loading vehicles..."
  />
);

export const StarshipsPage = () => (
  <CategoryPage
    category="starships"
    loadingText="Loading starships..."
  />
);