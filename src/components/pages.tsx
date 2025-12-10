// FILE: pages.tsx
// Super-premium upgraded SWAPI category pages with glass cards, 
// VisionOS-style layout, and py4e → swapi.dev fallback support.

import React from "react";
import { Link } from "react-router-dom";
import { useSwapi, SwapiListResponse, SwapiItem } from "./useSwapi";
import { CategoryHeader } from "./CategoryHeader";
import styles from "./pages.module.css";
import { HoloHeader } from "./HoloHeader";

interface CategoryPageProps {
  theme: "light" | "dark";
}

/* -----------------------------------------------
   Shared helpers
----------------------------------------------- */

// Safe formatting
const safe = (v: unknown): string => {
  if (v === undefined || v === null) return "—";
  if (typeof v === "string" || typeof v === "number") return String(v);
  return "—";
};

// Unified display name for ANY SWAPI item
const getLabel = (item: SwapiItem): string =>
  (item as any).name ??
  (item as any).title ??
  "Unknown";

// Fallback-friendly list request
const useCategoryList = (endpoint: string) => {
  return useSwapi<SwapiListResponse<SwapiItem>>(endpoint);
};

/* -----------------------------------------------
   Premium ListGrid (cards)
----------------------------------------------- */

const ListGrid: React.FC<{
  items: SwapiItem[];
  category: string;
}> = ({ items, category }) => {
  return (
    <div className={styles.grid}>
      {items.map((item, index) => {
        const url = safe(item.url);
        const idFromUrl = url.split("/").filter(Boolean).pop();
        const id = idFromUrl || String(index + 1);

        const label = getLabel(item);

        const secondary =
          safe(
            item.model ??
              item.classification ??
              item.director ??
              item.climate ??
              item.gender ??
              item.starship_class ??
              ""
          ) || "—";

        return (
          <Link
            key={`${category}-${id}`}
            to={`/${category}/${id}`}
            className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.recordHeader}>Record</span>
              <span>ID: {id}</span>
            </div>

            <div className={styles.title}>{label}</div>

            {secondary !== "—" && (
              <div className={styles.secondary}>
                {secondary}
              </div>
            )}

            <div className={styles.openDetail}>
              Open detail →
            </div>
          </Link>
        );
      })}
    </div>
  );
};

/* -----------------------------------------------
   Individual category pages
----------------------------------------------- */

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={styles.pageWrapper}>
    {children}
  </div>
);

export const FilmsPage: React.FC<CategoryPageProps> = ({ theme }) => {
  const { data, loading, error } = useCategoryList("films");
  const items = data?.results ?? [];

  return (
    <PageWrapper>
      <HoloHeader category="films" theme={theme} />
      {loading && <p className={styles.loading}>Loading film data…</p>}
      {error && <p className={styles.error}>Transmission error: {error}</p>}
      {!loading && !error && <ListGrid items={items} category="films" />}
    </PageWrapper>
  );
};

export const PeoplePage: React.FC<CategoryPageProps> = ({ theme }) => {
  const { data, loading, error } = useCategoryList("people");
  const items = data?.results ?? [];

  return (
    <PageWrapper>
      <HoloHeader category="people" theme={theme} />
      {loading && <p className={styles.loading}>Loading character data…</p>}
      {error && <p className={styles.error}>Transmission error: {error}</p>}
      {!loading && !error && <ListGrid items={items} category="people" />}
    </PageWrapper>
  );
};

export const PlanetsPage: React.FC<CategoryPageProps> = ({ theme }) => {
  const { data, loading, error } = useCategoryList("planets");
  const items = data?.results ?? [];

  return (
    <PageWrapper>
      <HoloHeader category="planets" theme={theme} />
      {loading && <p className={styles.loading}>Loading planetary data…</p>}
      {error && <p className={styles.error}>Transmission error: {error}</p>}
      {!loading && !error && <ListGrid items={items} category="planets" />}
    </PageWrapper>
  );
};

export const SpeciesPage: React.FC<CategoryPageProps> = ({ theme }) => {
  const { data, loading, error } = useCategoryList("species");
  const items = data?.results ?? [];

  return (
    <PageWrapper>
      <HoloHeader category="species" theme={theme} />
      {loading && <p className={styles.loading}>Loading species data…</p>}
      {error && <p className={styles.error}>Transmission error: {error}</p>}
      {!loading && !error && <ListGrid items={items} category="species" />}
    </PageWrapper>
  );
};

export const VehiclesPage: React.FC<CategoryPageProps> = ({ theme }) => {
  const { data, loading, error } = useCategoryList("vehicles");
  const items = data?.results ?? [];

  return (
    <PageWrapper>
      <HoloHeader category="vehicles" theme={theme} />
      {loading && <p className={styles.loading}>Loading vehicle data…</p>}
      {error && <p className={styles.error}>Transmission error: {error}</p>}
      {!loading && !error && <ListGrid items={items} category="vehicles" />}
    </PageWrapper>
  );
};

export const StarshipsPage: React.FC<CategoryPageProps> = ({ theme }) => {
  const { data, loading, error } = useCategoryList("starships");
  const items = data?.results ?? [];

  return (
    <PageWrapper>
      <HoloHeader category="starships" theme={theme} />
      {loading && <p className={styles.loading}>Loading starship data…</p>}
      {error && <p className={styles.error}>Transmission error: {error}</p>}
      {!loading && !error && <ListGrid items={items} category="starships" />}
    </PageWrapper>
  );
};
// FILE: pages.tsx