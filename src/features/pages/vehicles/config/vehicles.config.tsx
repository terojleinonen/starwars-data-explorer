"use client";

import { DashboardConfig } from "@/features/dashboard/components/types";
import {
  extractId,
  unique,
  toNumber,
} from "@/lib/dashboard/dashboardUtils";

import VehicleCard from "../components/VehicleCard";
import VehiclePanel from "../components/VehiclePanel";

/* =========================
   TYPES
========================= */

type Vehicle = {
  name: string;
  model: string;
  manufacturer: string;
  vehicle_class: string;
  crew: string;
  passengers: string;
  cost_in_credits: string;
  max_atmosphering_speed: string;
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

    renderStats: (all, visible) => {
      const fastest =
        all
          .map((v) => ({
            name: v.name,
            speed: toNumber(v.max_atmosphering_speed),
          }))
          .sort((a, b) => b.speed - a.speed)[0];

      const avgCrew =
        Math.round(
          all
            .map((v) => toNumber(v.crew))
            .filter((n) => n > 0)
            .reduce((a, b) => a + b, 0) /
            (all.length || 1)
        ) || "—";

      return (
        <div style={{ display: "flex", gap: 12 }}>
          <div>
            <span>Total Units</span>
            <strong>{all.length}</strong>
          </div>

          <div>
            <span>Visible</span>
            <strong>{visible.length}</strong>
          </div>

          <div>
            <span>Fastest</span>
            <strong>
              {fastest ? `${fastest.name}` : "—"}
            </strong>
          </div>

          <div>
            <span>Avg Crew</span>
            <strong>{avgCrew}</strong>
          </div>
        </div>
      );
    },
  };
}