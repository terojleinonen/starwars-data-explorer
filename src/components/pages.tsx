// FILE: pages.tsx
// Premium SWAPI category pages with PlanetHeader integration + live listing cards

import React from "react";
import { Link } from "react-router-dom";
import PlanetHeader from "./PlanetHeader";
import { useSwapi, SwapiListResponse, SwapiItem } from "./useSwapi";

interface CategoryPageProps {
  theme: "light" | "dark";
}

const safe = (v: unknown): string => {
  if (v === undefined || v === null) return "—";
  if (typeof v === "string" || typeof v === "number") return String(v);
  return "—";
};

const useCategoryList = (endpoint: string) => {
  return useSwapi<SwapiListResponse<SwapiItem>>(endpoint);
};

const ListGrid: React.FC<{
  items: SwapiItem[];
  category: string;
}> = ({ items, category }) => {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => {
        const url = safe(item.url);
        const idFromUrl = url.split("/").filter(Boolean).pop();
        const id = idFromUrl || String(index + 1);

        const name = safe(item.name || item.title || `Record ${id}`);

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
            className="group card-lift rounded-2xl border px-5 py-5 transition-all bg-white/5 border-slate-700/60 hover:border-sky-400/70 dark:bg-slate-900/70"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">
                Record
              </span>
              <span className="text-[0.65rem] text-slate-400">ID: {id}</span>
            </div>
            <div className="mb-1 text-base font-semibold sm:text-lg">{name}</div>
            {secondary && secondary !== "—" && (
              <div className="mb-2 text-xs text-slate-400 group-hover:text-slate-100">
                {secondary}
              </div>
            )}
            <div className="mt-1 text-[0.7rem] uppercase tracking-[0.25em] text-sky-400/90">
              Open detail console →
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export const FilmsPage: React.FC<CategoryPageProps> = ({ theme }) => {
  const { data, loading, error } = useCategoryList("films");
  const items = data?.results ?? [];

  return (
    <div className="fade-in mx-auto max-w-6xl px-4 pb-20 pt-6">
      <PlanetHeader
        theme={theme}
        title="Films"
        subtitle="Cinematic records from the Galactic Archive"
        metrics={{ category: "films", director: "Lucas", release_date: "1977", episode_id: "4" }}
      />

      {loading && <p className="mt-6 opacity-70">Loading film data…</p>}
      {error && (
        <p className="mt-6 text-sm text-red-400">Transmission error: {error}</p>
      )}
      {!loading && !error && <ListGrid items={items} category="films" />}
    </div>
  );
};

export const PeoplePage: React.FC<CategoryPageProps> = ({ theme }) => {
  const { data, loading, error } = useCategoryList("people");
  const items = data?.results ?? [];

  return (
    <div className="fade-in mx-auto max-w-6xl px-4 pb-20 pt-6">
      <PlanetHeader
        theme={theme}
        title="People"
        subtitle="Known individuals across the galaxy"
        metrics={{ category: "people", height: "172", mass: "77", gender: "male" }}
      />

      {loading && <p className="mt-6 opacity-70">Loading people data…</p>}
      {error && (
        <p className="mt-6 text-sm text-red-400">Transmission error: {error}</p>
      )}
      {!loading && !error && <ListGrid items={items} category="people" />}
    </div>
  );
};

export const PlanetsPage: React.FC<CategoryPageProps> = ({ theme }) => {
  const { data, loading, error } = useCategoryList("planets");
  const items = data?.results ?? [];

  return (
    <div className="fade-in mx-auto max-w-6xl px-4 pb-20 pt-6">
      <PlanetHeader
        theme={theme}
        title="Planets"
        subtitle="Geospheres, climates and environmental parameters"
        metrics={{ category: "planets", gravity: "1g", climate: "Arid", orbital_period: "304" }}
      />

      {loading && <p className="mt-6 opacity-70">Loading planet data…</p>}
      {error && (
        <p className="mt-6 text-sm text-red-400">Transmission error: {error}</p>
      )}
      {!loading && !error && <ListGrid items={items} category="planets" />}
    </div>
  );
};

export const SpeciesPage: React.FC<CategoryPageProps> = ({ theme }) => {
  const { data, loading, error } = useCategoryList("species");
  const items = data?.results ?? [];

  return (
    <div className="fade-in mx-auto max-w-6xl px-4 pb-20 pt-6">
      <PlanetHeader
        theme={theme}
        title="Species"
        subtitle="Lifeforms and biological classifications"
        metrics={{ category: "species", classification: "mammal", language: "Basic", average_lifespan: "80" }}
      />

      {loading && <p className="mt-6 opacity-70">Loading species data…</p>}
      {error && (
        <p className="mt-6 text-sm text-red-400">Transmission error: {error}</p>
      )}
      {!loading && !error && <ListGrid items={items} category="species" />}
    </div>
  );
};

export const VehiclesPage: React.FC<CategoryPageProps> = ({ theme }) => {
  const { data, loading, error } = useCategoryList("vehicles");
  const items = data?.results ?? [];

  return (
    <div className="fade-in mx-auto max-w-6xl px-4 pb-20 pt-6">
      <PlanetHeader
        theme={theme}
        title="Vehicles"
        subtitle="Ground and atmospheric transports"
        metrics={{ category: "vehicles", model: "T-47", max_atmosphering_speed: "1000", crew: "2" }}
      />

      {loading && <p className="mt-6 opacity-70">Loading vehicle data…</p>}
      {error && (
        <p className="mt-6 text-sm text-red-400">Transmission error: {error}</p>
      )}
      {!loading && !error && <ListGrid items={items} category="vehicles" />}
    </div>
  );
};

export const StarshipsPage: React.FC<CategoryPageProps> = ({ theme }) => {
  const { data, loading, error } = useCategoryList("starships");
  const items = data?.results ?? [];

  return (
    <div className="fade-in mx-auto max-w-6xl px-4 pb-20 pt-6">
      <PlanetHeader
        theme={theme}
        title="Starships"
        subtitle="Interstellar vessels and propulsion capabilities"
        metrics={{ category: "starships", model: "X-wing", hyperdrive_rating: "1.0", crew: "1" }}
      />

      {loading && <p className="mt-6 opacity-70">Loading starship data…</p>}
      {error && (
        <p className="mt-6 text-sm text-red-400">Transmission error: {error}</p>
      )}
      {!loading && !error && <ListGrid items={items} category="starships" />}
    </div>
  );
};