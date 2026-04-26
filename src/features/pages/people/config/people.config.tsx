"use client";

import { DashboardConfig } from "@/features/dashboard/components/types";
import { extractId, unique, toNumber } from "@/lib/dashboard/dashboardUtils";

import PeopleCard from "../components/PeopleCard";
import PeoplePanel from "../components/PeoplePanel";

/* =========================
   TYPES
========================= */

type Person = {
  name: string;
  height: string;
  mass: string;
  gender: string;
  birth_year: string;
  url: string;
};

/* =========================
   CONFIG
========================= */

export function createPeopleConfig(
  records: Person[]
): DashboardConfig<Person> {
  return {
    category: "people",
    title: "Personnel Intelligence",
    subtitle: "Classified records of known individuals",

    records,

    extractId: (p) => extractId(p.url),

    /* ===== SEARCH ===== */

    matchesSearch: (p, search) =>
      p.name.toLowerCase().includes(search.toLowerCase()),

    /* ===== FILTERS ===== */

    filters: [
      {
        key: "gender",
        label: "Gender",
        getOptions: (records) =>
          unique(records.map((p) => p.gender)),

        matches: (record, selected) =>
          !selected.length || selected.includes(record.gender),
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
          toNumber(b.height) - toNumber(a.height),
      },
      {
        label: "Mass (High)",
        value: "mass-desc",
        compare: (a, b) =>
          toNumber(b.mass) - toNumber(a.mass),
      },
    ],

    /* ===== RENDER ===== */

    renderCard: (record, active, onSelect) => (
      <PeopleCard
        key={record.url}
        person={record}
        active={active}
        onClick={onSelect}
      />
    ),

    renderPanel: (record) => (
      <PeoplePanel person={record} />
    ),

    /* ===== STATS (OPTIONAL) ===== */

    renderStats: (all, visible) => {
      const avgHeight =
        Math.round(
          all
            .map((p) => toNumber(p.height))
            .filter((n) => n > 0)
            .reduce((a, b) => a + b, 0) /
            (all.length || 1)
        ) || "—";

      return (
        <div style={{ display: "flex", gap: 12 }}>
          <div>
            <span>Total</span>
            <strong>{all.length}</strong>
          </div>

          <div>
            <span>Visible</span>
            <strong>{visible.length}</strong>
          </div>

          <div>
            <span>Avg Height</span>
            <strong>{avgHeight}</strong>
          </div>
        </div>
      );
    },
  };
}