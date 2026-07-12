"use client";

import { DashboardConfig } from "@/features/dashboard/components/types";
import {
  extractId,
  unique,
  toNumber,
} from "@/lib/dashboard/dashboardUtils";

import VehicleCard from "../components/VehicleCard";
import VehiclePanel from "../components/VehiclePanel";
import { Vehicle } from "@/types/swapi";

/* =========================
   HELPERS
========================= */

function splitCSV(value: string) {
  return value.split(",").map((v) => v.trim());
}

/* =========================
   CONFIG
========================= */

export function createVehiclesConfig(
  records: Vehicle[]
): DashboardConfig<Vehicle> {
  return {
    category: "vehicles",
    title: "Ground & Tactical Vehicles",
    subtitle: "Operational equipment registry",

    records,

    extractId: (v) => extractId(v.url),

    /* ===== SEARCH ===== */

    matchesSearch: (v, search) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()),

    /* ===== FILTERS ===== */

    filters: [
      {
        key: "class",
        label: "Class",
        getOptions: (records) =>
          unique(records.map((v) => v.vehicle_class)),

        matches: (record, selected) =>
          !selected.length ||
          selected.includes(record.vehicle_class),
      },
      {
        key: "manufacturer",
        label: "Manufacturer",
        getOptions: (records) =>
          unique(
            records.flatMap((v) =>
              splitCSV(v.manufacturer)
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
        label: "Crew (High)",
        value: "crew-desc",
        compare: (a, b) =>
          toNumber(b.crew) - toNumber(a.crew),
      },
      {
        label: "Cost (High)",
        value: "cost-desc",
        compare: (a, b) =>
          toNumber(b.cost_in_credits) -
          toNumber(a.cost_in_credits),
      },
    ],

    /* ===== RENDER ===== */

    renderCard: (record, active, onSelect) => (
      <VehicleCard
        key={record.url}
        vehicle={record}
        active={active}
        onClick={onSelect}
      />
    ),

    renderPanel: (record) => (
      <VehiclePanel vehicle={record} />
    ),

    /* ===== STATS ===== */
    getStats: (records, filtered) => {
      const speeds = filtered.map((v) => toNumber(v.max_atmosphering_speed)).filter((n) => n > 0);
      const avgSpeed = speeds.length
        ? Math.round(speeds.reduce((a, b) => a + b, 0) / speeds.length)
        : "—";

      const crews = filtered.map((v) => toNumber(v.crew)).filter((n) => n > 0);
      const avgCrew = crews.length
        ? Math.round(crews.reduce((a, b) => a + b, 0) / crews.length)
        : "—";

      const costs = filtered.map((v) => toNumber(v.cost_in_credits)).filter((n) => n > 0);
      const avgCost = costs.length
        ? Math.round(costs.reduce((a, b) => a + b, 0) / costs.length)
        : "—";

      return [
        {
          label: "Vehicles",
          value: records.length,
          hint: "Known vehicles",
        },
        {
          label: "Average Speed",
          value: avgSpeed,
          hint: "Max atmosphering speed",
        },
        {
          label: "Average Crew",
          value: avgCrew,
          hint: "Crew members",
        },
        {
          label: "Average Cost",
          value: avgCost,
          hint: "Cost in credits",
        },
      ];
    },
  };
}