"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { HoloHeader } from "@/ui/HoloHeader";
import { PageWrapper } from "@/features/layout";
import { useSwapi } from "@/hooks/data/useSwapi";
import { setNavContext } from "@/lib/navigation/navigationContext";
import styles from "../styles/PlanetsDashboard.module.css";

/* =========================
   TYPES
========================= */

type Planet = {
  name: string;
  climate: string;
  terrain: string;
  population: string;
  diameter: string;
  gravity: string;
  rotation_period: string;
  orbital_period: string;
  url: string;
};

/* =========================
   HELPERS
========================= */

function extractId(url: string): string {
  return url.match(/\/(\d+)\/?$/)?.[1] ?? "";
}

function numeric(value: string): number | null {
  if (!value || value === "unknown" || value === "n/a") return null;
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function formatNumber(value: string): string {
  const n = numeric(value);
  return n === null ? "Unknown" : n.toLocaleString();
}

function formatPopulation(value: string): string {
  const n = numeric(value);
  return n === null ? "Unknown" : n.toLocaleString();
}

function titleCaseList(value: string): string {
  if (!value) return "Unknown";
  return value
    .split(",")
    .map(v => v.trim())
    .filter(Boolean)
    .map(v => v.charAt(0).toUpperCase() + v.slice(1))
    .join(", ");
}

function getUnique(values: string[]): string[] {
  return Array.from(
    new Set(
      values.flatMap(v =>
        v.split(",").map(x => x.trim()).filter(Boolean)
      )
    )
  ).sort((a, b) => a.localeCompare(b));
}

/* =========================
   VISUAL INTELLIGENCE
========================= */

function getPlanetColor(climate: string): string {
  const c = climate.toLowerCase();

  if (c.includes("desert") || c.includes("arid")) return "#b98b52";
  if (c.includes("ice") || c.includes("frozen")) return "#8baeff";
  if (c.includes("temperate")) return "#4f9b73";
  if (c.includes("tropical")) return "#2ca98a";
  if (c.includes("murky") || c.includes("swamp")) return "#556a57";

  return "#647de6";
}

function getPlanetProfile(planet: Planet) {
  const terrain = planet.terrain.toLowerCase();

  return {
    color: getPlanetColor(planet.climate),

    type:
      terrain.includes("gas") ? "gas" :
      terrain.includes("desert") ? "desert" :
      terrain.includes("ice") ? "ice" :
      terrain.includes("ocean") ? "ocean" :
      terrain.includes("forest") ? "lush" :
      "rocky",

    ringType:
      terrain.includes("gas") ? "gas" :
      numeric(planet.diameter) && numeric(planet.diameter)! > 12000 ? "ice" :
      "dust",

    moons: (() => {
      const pop = numeric(planet.population);
      if (!pop) return 0;
      if (pop > 1_000_000_000) return 3;
      if (pop > 1_000_000) return 2;
      return 1;
    })()
  };
}

/* =========================
   METRICS
========================= */

function avgPopulation(records: Planet[]) {
  const nums = records.map(r => numeric(r.population)).filter(Boolean) as number[];
  if (!nums.length) return "—";
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length).toLocaleString();
}

function avgDiameter(records: Planet[]) {
  const nums = records.map(r => numeric(r.diameter)).filter(Boolean) as number[];
  if (!nums.length) return "—";
  return `${Math.round(nums.reduce((a, b) => a + b, 0) / nums.length).toLocaleString()} km`;
}

/* =========================
   COMPONENT
========================= */

export default function PlanetsDashboard() {
  const { data, loading, error } = useSwapi("planets");
  const records = (data?.results ?? []) as Planet[];

  const [search, setSearch] = useState("");
  const [climate, setClimate] = useState("all");
  const [terrain, setTerrain] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setNavContext("planets", "/planets");
  }, []);

  /* =========================
     FILTERS
  ========================= */

  const climates = useMemo(() => getUnique(records.map(p => p.climate)), [records]);
  const terrains = useMemo(() => getUnique(records.map(p => p.terrain)), [records]);

  const filtered = useMemo(() => {
    return records.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;

      if (climate !== "all" && !p.climate.toLowerCase().includes(climate.toLowerCase()))
        return false;

      if (terrain !== "all" && !p.terrain.toLowerCase().includes(terrain.toLowerCase()))
        return false;

      return true;
    });
  }, [records, search, climate, terrain]);

  /* =========================
     SELECTION FIX (IMPORTANT)
  ========================= */

  useEffect(() => {
    if (!filtered.length) {
      setSelectedId(null);
      return;
    }

    if (!selectedId || !filtered.some(p => extractId(p.url) === selectedId)) {
      setSelectedId(extractId(filtered[0].url));
    }
  }, [filtered, selectedId]);

  const selected = filtered.find(p => extractId(p.url) === selectedId) ?? null;

  /* =========================
     RENDER
  ========================= */

  return (
    <PageWrapper>
        <div className={styles.page}>
          <HoloHeader
            category="planets"
            title="Planetary Intelligence"
            subtitle="Analyze climate, terrain, and population across systems"
          />

          {/* STATS */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <span>Total Records</span>
              <strong>{records.length}</strong>
            </div>

            <div className={styles.statCard}>
              <span>Visible</span>
              <strong>{filtered.length}</strong>
            </div>

            <div className={styles.statCard}>
              <span>Avg Population</span>
              <strong>{avgPopulation(records)}</strong>
            </div>

            <div className={styles.statCard}>
              <span>Avg Diameter</span>
              <strong>{avgDiameter(records)}</strong>
            </div>
          </div>

          {/* CONTROLS */}
          <div className={styles.controls}>
            <input
              placeholder="Search planets..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={styles.searchInput}
            />

            <select value={climate} onChange={e => setClimate(e.target.value)} className={styles.select}>
              <option value="all">All climates</option>
              {climates.map(c => (
                <option key={c} value={c}>{titleCaseList(c)}</option>
              ))}
            </select>

            <select value={terrain} onChange={e => setTerrain(e.target.value)} className={styles.select}>
              <option value="all">All terrains</option>
              {terrains.map(t => (
                <option key={t} value={t}>{titleCaseList(t)}</option>
              ))}
            </select>
          </div>

          {/* MAIN */}
          <div className={styles.dashboardShell}>
            {/* GRID */}
            <div className={styles.gridPanel}>
              <div className={styles.grid}>
                {filtered.map(p => {
                  const id = extractId(p.url);
                  const active = selectedId === id;
                  const profile = getPlanetProfile(p);

                  return (
                    <button
                      key={id}
                      className={`${styles.card} ${active ? styles.cardActive : ""}`}
                      onClick={() => setSelectedId(id)}
                    >
                      <div
                        className={`${styles.planetVisual} ${styles[`type_${profile.type}`]}`}
                        style={{ ["--planet-color" as any]: profile.color }}
                      >
                        <div className={styles.planetAtmosphere} />
                        <div className={styles.planetSphere} />

                        <div className={`${styles.ring} ${styles[`ring_${profile.ringType}`]}`} />

                        <div className={styles.moonSystem}>
                          {Array.from({ length: profile.moons }).map((_, i) => (
                            <div
                              key={i}
                              className={styles.moonOrbit}
                              style={{
                                ["--orbit-size" as any]: `${60 + i * 14}px`,
                                ["--speed" as any]: `${10 + i * 3}s`
                              }}
                            >
                              <div className={styles.moon} />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className={styles.cardContent}>
                        <h3>{p.name}</h3>
                        <p>{titleCaseList(p.climate)}</p>
                        <span>{formatPopulation(p.population)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SIDE PANEL */}
            <aside className={styles.previewPanel}>
              {selected && (
                <>
                  <h2>{selected.name}</h2>

                  <div className={styles.meta}>
                    <div><span>Climate</span><strong>{titleCaseList(selected.climate)}</strong></div>
                    <div><span>Terrain</span><strong>{titleCaseList(selected.terrain)}</strong></div>
                    <div><span>Population</span><strong>{formatPopulation(selected.population)}</strong></div>
                    <div><span>Gravity</span><strong>{selected.gravity}</strong></div>
                    <div><span>Diameter</span><strong>{formatNumber(selected.diameter)}</strong></div>
                  </div>

                  <Link href={`/planets/${extractId(selected.url)}`} className={styles.profileLink}>
                    Open Full Record
                  </Link>
                </>
              )}
            </aside>
          </div>
        </div>
    </PageWrapper>
  );
}