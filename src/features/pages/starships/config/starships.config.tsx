"use client";

import { DashboardConfig } from "@/features/dashboard/components/types";
import {
  extractId,
  unique,
  toNumber,
} from "@/lib/dashboard/dashboardUtils";

import StarshipCard from "../components/StarshipCard";
import StarshipPanel from "../components/StarshipPanel";

/* =========================
   TYPES
========================= */

type Starship = {
  name: string;
  model: string;
  manufacturer: string;
  starship_class: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  max_atmosphering_speed: string;
  hyperdrive_rating: string;
  MGLT: string;
  cost_in_credits: string;
  url: string;
};

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
        starship={record}
        active={active}
        onClick={onSelect}
      />
    ),

    renderPanel: (record) => (
      <StarshipPanel starship={record} />
    ),

    /* ===== STATS ===== */

    renderStats: (all, visible) => {
      const fastest =
        all
          .map((s) => ({
            name: s.name,
            speed: toNumber(s.max_atmosphering_speed),
          }))
          .sort((a, b) => b.speed - a.speed)[0];

      const bestHyperdrive =
        all
          .map((s) => ({
            name: s.name,
            hyper: toNumber(s.hyperdrive_rating),
          }))
          .filter((s) => s.hyper > 0)
          .sort((a, b) => a.hyper - b.hyper)[0];

      const avgCargo =
        Math.round(
          all
            .map((s) => toNumber(s.cargo_capacity))
            .filter((n) => n > 0)
            .reduce((a, b) => a + b, 0) /
            (all.length || 1)
        ) || "—";

      return (
        <div style={{ display: "flex", gap: 12 }}>
          <div>
            <span>Total Fleet</span>
            <strong>{all.length}</strong>
          </div>

          <div>
            <span>Visible</span>
            <strong>{visible.length}</strong>
          </div>

          <div>
            <span>Fastest</span>
            <strong>{fastest?.name || "—"}</strong>
          </div>

          <div>
            <span>Best Hyperdrive</span>
            <strong>{bestHyperdrive?.name || "—"}</strong>
          </div>

          <div>
            <span>Avg Cargo</span>
            <strong>{avgCargo}</strong>
          </div>
        </div>
      );
    },
  };
}