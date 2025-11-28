// FILE: DetailsPage.tsx
// Strict TypeScript Detail Page for ALL categories
// Uses useSwapi, auto-metrics, PlanetHeader, and premium glass data panel.

import { motion } from "framer-motion";
import React from "react";
import { useParams } from "react-router-dom";
import PlanetHeader from "./PlanetHeader";
import { useSwapi, SwapiItem } from "./useSwapi";

interface DetailsPageProps {
  theme: "light" | "dark";
}

type Category =
  | "films"
  | "people"
  | "planets"
  | "species"
  | "vehicles"
  | "starships";

const safe = (v: unknown): string => {
  if (v === undefined || v === null) return "—";
  if (typeof v === "string" || typeof v === "number") return String(v);
  return "—";
};

const deriveMetrics = (category: Category, item: SwapiItem) => {
  switch (category) {
    case "planets":
      return {
        category,
        gravity: safe(item.gravity),
        climate: safe(item.climate),
        orbital_period: safe(item.orbital_period),
      };
    case "people":
      return {
        category,
        height: safe(item.height),
        mass: safe(item.mass),
        gender: safe(item.gender),
      };
    case "films":
      return {
        category,
        director: safe(item.director),
        release_date: safe(item.release_date),
        episode_id: safe(item.episode_id),
      };
    case "species":
      return {
        category,
        classification: safe(item.classification),
        language: safe(item.language),
        average_lifespan: safe(item.average_lifespan),
      };
    case "vehicles":
      return {
        category,
        model: safe(item.model),
        max_atmosphering_speed: safe(item.max_atmosphering_speed),
        crew: safe(item.crew),
      };
    case "starships":
      return {
        category,
        model: safe(item.model),
        hyperdrive_rating: safe(item.hyperdrive_rating),
        crew: safe(item.crew),
      };
    default:
      return { category };
  }
};

const DetailsPage: React.FC<DetailsPageProps> = ({ theme }) => {
  const { category, id } = useParams<{ category: Category; id: string }>();

  if (!category || !id)
    return <p className="p-6 text-red-400">Invalid route parameters.</p>;

  const { data, loading, error } = useSwapi<SwapiItem>(`${category}/${id}`);

  const name = safe(data?.name || data?.title || `Record ${id}`);
  const metrics = data ? deriveMetrics(category, data) : { category };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.45, ease: "easeOut" }} className="fade-in mx-auto max-w-6xl px-4 pb-20 pt-6">
      <PlanetHeader
        theme={theme}
        title={name}
        subtitle={`Detailed ${category} record #${id}`}
        metrics={metrics}
      />

      {loading && <p className="mt-6 opacity-70">Loading record…</p>}
      {error && (
        <p className="mt-6 text-sm text-red-400">Transmission error: {error}</p>
      )}

      {!loading && !error && data && (
        <div
          className={`mt-8 rounded-3xl border p-6 backdrop-blur-xl shadow-xl text-sm sm:text-base ${
            theme === "dark"
              ? "bg-slate-900/60 border-slate-700/60"
              : "bg-white/80 border-slate-200/80"
          }`}
        >
          <h2 className="mb-4 text-xl font-semibold">Full Data</h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Object.entries(data).map(([key, value]) => {
              // ignore nested arrays or objects for now
              const printable =
                typeof value === "string" || typeof value === "number"
                  ? String(value)
                  : Array.isArray(value)
                  ? `${value.length} entries`
                  : typeof value === "object" && value !== null
                  ? "object"
                  : safe(value);

              return (
                <div
                  key={key}
                  className="rounded-xl border border-slate-700/30 bg-slate-800/20 p-3 dark:bg-slate-900/30"
                >
                  <div className="text-[0.65rem] uppercase tracking-[0.25em] text-slate-400">
                    {key.replace(/_/g, " ")}
                  </div>
                  <div className="text-sm font-medium">{printable}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};
export default DetailsPage;