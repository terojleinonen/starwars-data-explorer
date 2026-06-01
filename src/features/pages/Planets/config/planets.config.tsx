"use client";

import { DashboardConfig } from "@/features/dashboard/components/types";
import {
  extractId,
  unique,
  toNumber,
} from "@/lib/dashboard/dashboardUtils";
import type { Planet } from "@/types/swapi";

import PlanetCard from "../components/PlanetCard";
import PlanetPanel from "../components/PlanetPanel";

/* =========================
   HELPERS
========================= */

function splitCSV(value: string) {
  return value.split(",").map((v) => v.trim());
}

/* =========================
   CONFIG
========================= */

export function createPlanetsConfig(
  records: Planet[]
): DashboardConfig<Planet> {
  return {
    category: "planets",
    title: "Planetary Intelligence",
    subtitle: "Survey database of known worlds",

    records,

    extractId: (p) => extractId(p.url),

    /* ===== SEARCH ===== */

    matchesSearch: (p, search) =>
      p.name.toLowerCase().includes(search.toLowerCase()),

    /* ===== FILTERS ===== */

    filters: [
      {
        key: "climate",
        label: "Climate",
        getOptions: (records) =>
          unique(records.flatMap((p) => splitCSV(p.climate))),

        matches: (record, selected) =>
          !selected.length ||
          splitCSV(record.climate).some((c) =>
            selected.includes(c)
          ),
      },
      {
        key: "terrain",
        label: "Terrain",
        getOptions: (records) =>
          unique(records.flatMap((p) => splitCSV(p.terrain))),

        matches: (record, selected) =>
          !selected.length ||
          splitCSV(record.terrain).some((t) =>
            selected.includes(t)
          ),
      },
    ],

    /* ===== SORT ===== */

    sorts: [
      {
        label: "Name (A–Z)",
        value: "name-asc",
        compare: (a, b) => a.name.localeCompare(b.name),
      },
      {
        label: "Population (High)",
        value: "population-desc",
        compare: (a, b) =>
          toNumber(b.population) - toNumber(a.population),
      },
      {
        label: "Diameter (Large)",
        value: "diameter-desc",
        compare: (a, b) =>
          toNumber(b.diameter) - toNumber(a.diameter),
      },
      {
        label: "Rotation (Fast)",
        value: "rotation-asc",
        compare: (a, b) =>
          toNumber(a.rotation_period) -
          toNumber(b.rotation_period),
      },
    ],

    /* ===== RENDER ===== */

    renderCard: (record, active, onSelect) => (
      <PlanetCard
        key={record.url}
        planet={record}
        active={active}
        onClick={onSelect}
      />
    ),

    renderPanel: (record) => (
      <PlanetPanel planet={record}/>
    ),

    /* ===== STATS ===== */

    getStats: (records, filtered) => [
      {
        label: "Worlds",
        value: records.length,
        hint: "Known planets",
      },
      {
        label: "Average Diameter",
        value: Math.round(
          filtered
            .map((p) => toNumber(p.diameter))
            .filter((n) => n > 0)
            .reduce((a, b) => a + b, 0) /
            (filtered.length || 1)
        ) || "—",
        hint: "After filters",
      },
      {
        label: "Average Rotation",
        value: Math.round(
          filtered
            .map((p) => toNumber(p.rotation_period))
            .filter((n) => n > 0)
            .reduce((a, b) => a + b, 0) /
            (filtered.length || 1)
        ) || "—",
        hint: "After filters",
      },
      {
        label: "Orbital Period",
        value: records.filter(
          p => p.orbital_period !== "0"
        ).length,
        hint: "Planets with known year length",
      },
      {
        label: "Habitable",
        value: records.filter(
          p => p.population !== "0"
        ).length,
        hint: "Populated worlds",
      },
    ],
  };
}