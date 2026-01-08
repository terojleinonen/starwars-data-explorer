"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import RecordGrid from "@/components/records/RecordGrid";
import HoloHeader from "@/components/HoloHeader/HoloHeader";
import { useSwapi } from "@/components/useSwapi";
import { SwapiType } from "@/components/types/swapi-types";
import styles from "./CategoryPage.module.css";

type Props = {
  category: SwapiType;
  loadingText: string;
};

const CategoryPage = ({ category, loadingText }: Props) => {
  const { data, loading, error } = useSwapi(category);
  const items = data?.results ?? [];

  return (
    <PageWrapper>
      <HoloHeader category={category} title="" />

      {loading && <p className={styles.loading}>{loadingText}</p>}
      {error && <p className={styles.error}>Transmission error</p>}

      {!loading && !error && (
        <RecordGrid
          items={items}
          category={category}
        />
      )}
    </PageWrapper>
  );
};

export const FilmsPage = () => (
  <CategoryPage category="films" loadingText="Loading film data…" />
);
export const PeoplePage = () => (
  <CategoryPage category="people" loadingText="Loading character data…" />
);
export const PlanetsPage = () => (
  <CategoryPage category="planets" loadingText="Loading planetary data…" />
);
export const SpeciesPage = () => (
  <CategoryPage category="species" loadingText="Loading species data…" />
);
export const VehiclesPage = () => (
  <CategoryPage category="vehicles" loadingText="Loading vehicle data…" />
);
export const StarshipsPage = () => (
  <CategoryPage category="starships" loadingText="Loading starship data…" />
);