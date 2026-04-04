"use client";

import { useEffect, useMemo, useState } from "react";
import { PageWrapper } from "@/features/layout";
import { RecordGrid } from "@/features/records";
import { HoloHeader } from "@/ui/HoloHeader";
import { useSwapi } from "@/hooks/data/useSwapi";
import { SwapiType } from "@/lib/swapi/swapiTypes";
import { setNavContext } from "@/lib/navigation/navigationContext";
import PeopleDashboard from "@/features/people/components/PeopleDashboard";
import PlanetsDashboard from "@/features/Planets/components/PlanetsDashboard";
import StarshipsDashboard from "@/features/starships/components/StarshipsDashboard";
import SpeciesDashboard from "@/features/species/components/SpeciesDashboard";
import VehiclesDashboard from "@/features/vehicles/components/VehiclesDashboard";
import FilmsTimelinePage from "@/features/films/components/FilmsTimeLinePage";
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
    return items.filter((item: any) => {
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
  <FilmsTimelinePage />
);

export const PeoplePage = () => (
  <PeopleDashboard />
);

export const PlanetsPage = () => (
  <PlanetsDashboard />
);

export const SpeciesPage = () => (
  <SpeciesDashboard />
);

export const VehiclesPage = () => (  
  <VehiclesDashboard />
);

export const StarshipsPage = () => (
  <StarshipsDashboard />
);