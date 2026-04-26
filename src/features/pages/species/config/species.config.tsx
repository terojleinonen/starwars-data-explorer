"use client";

import { DashboardConfig } from "@/features/dashboard/components/types";
import {
  extractId,
  unique,
  toNumber,
} from "@/lib/dashboard/dashboardUtils";

import SpeciesCard from "../components/SpeciesCard";
import SpeciesPanel from "../components/SpeciesPanel";

/* =========================
   TYPES
========================= */

type Species = {
  name: string;
  classification: string;
  designation: string;
  average_height: string;
  average_lifespan: string;
  language: string;
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

export function createSpeciesConfig(
  records: Species[]
): DashboardConfig<Species> {
  return {
    category: "species",
    title: "Species Intelligence",
    subtitle: "Biological classification and analysis database",

    records,

    extractId: (s) => extractId(s.url),

    /* ===== SEARCH ===== */

    matchesSearch: (s, search) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.classification.toLowerCase().includes(search.toLowerCase()),

    /* ===== FILTERS ===== */

    filters: [
      {
        key: "classification",
        label: "Classification",
        getOptions: (records) =>
          unique(records.map((s) => s.classification)),

        matches: (record, selected) =>
          !selected.length ||
          selected.includes(record.classification),
      },
      {
        key: "language",
        label: "Language",
        getOptions: (records) =>
          unique(records.flatMap((s) => splitCSV(s.language))),

        matches: (record, selected) =>
          !selected.length ||
          splitCSV(record.language).some((l) =>
            selected.includes(l)
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
        label: "Height (High)",
        value: "height-desc",
        compare: (a, b) =>
          toNumber(b.average_height) -
          toNumber(a.average_height),
      },
      {
        label: "Lifespan (Long)",
        value: "lifespan-desc",
        compare: (a, b) =>
          toNumber(b.average_lifespan) -
          toNumber(a.average_lifespan),
      },
    ],

    /* ===== RENDER ===== */

    renderCard: (record, active, onSelect) => (
      <SpeciesCard
        key={record.url}
        species={record}
        active={active}
        onClick={onSelect}
      />
    ),

    renderPanel: (record) => (
      <SpeciesPanel species={record} />
    ),

    /* ===== STATS ===== */

    renderStats: (all, visible) => {
      const avgLifespan =
        Math.round(
          all
            .map((s) => toNumber(s.average_lifespan))
            .filter((n) => n > 0)
            .reduce((a, b) => a + b, 0) /
            (all.length || 1)
        ) || "—";

      const uniqueClasses = unique(
        all.map((s) => s.classification)
      ).length;

      return (
        <div style={{ display: "flex", gap: 12 }}>
          <div>
            <span>Total Species</span>
            <strong>{all.length}</strong>
          </div>

          <div>
            <span>Visible</span>
            <strong>{visible.length}</strong>
          </div>

          <div>
            <span>Classes</span>
            <strong>{uniqueClasses}</strong>
          </div>

          <div>
            <span>Avg Lifespan</span>
            <strong>{avgLifespan}</strong>
          </div>
        </div>
      );
    },
  };
}