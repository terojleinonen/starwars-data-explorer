"use client";

import { DashboardConfig } from "@/features/dashboard/components/types";
import {
  extractId,
  unique,
  toNumber,
} from "@/lib/dashboard/dashboardUtils";

import StarshipCard from "../components/StarshipCard";
import StarshipPanel from "../components/StarshipPanel";
import { Starship } from "@/types/swapi";

/* =========================
   HELPERS
========================= */

function splitCSV(value: string) {
  return value.split(",").map((v) => v.trim());
}

/* =========================
   CONFIG
========================= */

export function createStarshipsConfig(
  records: Starship[]
): DashboardConfig<Starship> {
  return {
    category: "starships",
    title: "Starship Intelligence",
    subtitle: "Fleet registry and tactical performance database",

    records,

    extractId: (s) => extractId(s.url),

    /* ===== SEARCH ===== */

    matchesSearch: (s, search) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.model.toLowerCase().includes(search.toLowerCase()),

    /* ===== FILTERS ===== */

    filters: [
      {
        key: "class",
        label: "Class",
        getOptions: (records) =>
          unique(records.map((s) => s.starship_class)),

        matches: (record, selected) =>
          !selected.length ||
          selected.includes(record.starship_class),
      },
      {
        key: "manufacturer",
        label: "Manufacturer",
        getOptions: (records) =>
          unique(
            records.flatMap((s) =>
              splitCSV(s.manufacturer)
            )
          ),

        matches: (record, selected) =>
          !selected.length ||
          splitCSV(record.manufacturer).some((m) =>
            selected.includes(m)
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
        label: "Speed (Fast)",
        value: "speed-desc",
        compare: (a, b) =>
          toNumber(b.max_atmosphering_speed) -
          toNumber(a.max_atmosphering_speed),
      },
      {
        label: "Hyperdrive (Fast)",
        value: "hyperdrive-asc",
        compare: (a, b) =>
          toNumber(a.hyperdrive_rating) -
          toNumber(b.hyperdrive_rating),
      },
      {
        label: "Cargo (High)",
        value: "cargo-desc",
        compare: (a, b) =>
          toNumber(b.cargo_capacity) -
          toNumber(a.cargo_capacity),
      },
      {
        label: "Crew (High)",
        value: "crew-desc",
        compare: (a, b) =>
          toNumber(b.crew) - toNumber(a.crew),
      },
    ],

    /* ===== RENDER ===== */

    renderCard: (record, active, onSelect) => (
      <StarshipCard
        key={record.url}
        ship={record}
        active={active}
        onClick={onSelect}
      />
    ),

    renderPanel: (record) => (
      <StarshipPanel ship={record} />
    ),

    /* ===== STATS ===== */
    getStats: (records, filtered) => {
      const speeds = filtered.map((s) => toNumber(s.max_atmosphering_speed)).filter((n) => n > 0);
      const avgSpeed = speeds.length
        ? Math.round(speeds.reduce((a, b) => a + b, 0) / speeds.length)
        : "—";

      const hyperdrives = filtered.map((s) => toNumber(s.hyperdrive_rating)).filter((n) => n > 0);
      const avgHyperdrive = hyperdrives.length
        ? Math.round(hyperdrives.reduce((a, b) => a + b, 0) / hyperdrives.length)
        : "—";

      const cargos = filtered.map((s) => toNumber(s.cargo_capacity)).filter((n) => n > 0);
      const avgCargo = cargos.length
        ? Math.round(cargos.reduce((a, b) => a + b, 0) / cargos.length)
        : "—";

      return [
        {
          label: "Starships",
          value: records.length,
          hint: "Known starships",
        },
        {
          label: "Average Speed",
          value: avgSpeed,
          hint: "Average max atmosphering speed",
        },
        {
          label: "Average Hyperdrive",
          value: avgHyperdrive,
          hint: "Average hyperdrive rating",
        },
        {
          label: "Cargo Capacity",
          value: avgCargo,
          hint: "Average cargo capacity",
        }
      ];
    },

  };
}