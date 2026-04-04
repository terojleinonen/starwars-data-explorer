"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HoloHeader } from "@/ui/HoloHeader";
import { PageWrapper } from "@/features/layout";
import ContentContainer from "@/features/layout/components/ContentContainer";
import { useSwapi } from "@/hooks/data/useSwapi";
import { setNavContext } from "@/lib/navigation/navigationContext";
import styles from "../styles/PlanetsDashboard.module.css";

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

function extractId(url: string) {
  return url.match(/\/(\d+)\/?$/)?.[1] ?? "";
}

function formatPopulation(value: string) {
  if (!value || value === "unknown") return "Unknown";
  return Number(value).toLocaleString();
}

function numeric(value: string): number | null {
  if (!value || value === "unknown") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function getUnique(values: string[]) {
  return Array.from(new Set(values.flatMap(v => v.split(", ").map(x => x.trim()))));
}

function getPlanetColor(climate: string) {
  if (climate.includes("desert")) return "#c9a46c";
  if (climate.includes("ice")) return "#a9d6ff";
  if (climate.includes("temperate")) return "#5fae7b";
  if (climate.includes("tropical")) return "#3dbb8b";
  if (climate.includes("arid")) return "#b68b5c";
  if (climate.includes("murky")) return "#5a6f63";
  return "#6f8cff";
}

function hasRings(planet: Planet) {
  return planet.name === "Saturn-like" || planet.diameter === "120000";
}

function hasMoon(planet: Planet) {
  return planet.population !== "unknown";
}

export default function PlanetsDashboard() {
  const router = useRouter();
  const { data, loading, error } = useSwapi("planets");
  const records = (data?.results ?? []) as Planet[];

  const [search, setSearch] = useState("");
  const [climate, setClimate] = useState("all");
  const [terrain, setTerrain] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setNavContext("planets", "/planets");
  }, []);

  const climates = useMemo(() => getUnique(records.map(p => p.climate)), [records]);
  const terrains = useMemo(() => getUnique(records.map(p => p.terrain)), [records]);

  const filtered = useMemo(() => {
    return records.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (climate !== "all" && !p.climate.includes(climate)) return false;
      if (terrain !== "all" && !p.terrain.includes(terrain)) return false;
      return true;
    });
  }, [records, search, climate, terrain]);

  useEffect(() => {
    if (filtered.length && !selectedId) {
      setSelectedId(extractId(filtered[0].url));
    }
  }, [filtered, selectedId]);

  const selected = filtered.find(p => extractId(p.url) === selectedId);

  const total = records.length;
  const avgPopulation = useMemo(() => {
    const nums = records.map(r => numeric(r.population)).filter(Boolean) as number[];
    if (!nums.length) return "—";
    return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length).toLocaleString();
  }, [records]);

  return (
    <PageWrapper>
      <ContentContainer>
        <div className={styles.page}>
          <HoloHeader
            category="planets"
            title="Planetary Intelligence"
            subtitle="Analyze climate, terrain, and population across systems"
          />

          {/* STATS */}
          <div className={styles.stats}>
            <div className={styles.stat}><span>Total</span><strong>{total}</strong></div>
            <div className={styles.stat}><span>Visible</span><strong>{filtered.length}</strong></div>
            <div className={styles.stat}><span>Avg Population</span><strong>{avgPopulation}</strong></div>
          </div>

          {/* CONTROLS */}
          <div className={styles.controls}>
            <input
              placeholder="Search planets..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={styles.input}
            />

            <select value={climate} onChange={e => setClimate(e.target.value)} className={styles.select}>
              <option value="all">All climates</option>
              {climates.map(c => <option key={c}>{c}</option>)}
            </select>

            <select value={terrain} onChange={e => setTerrain(e.target.value)} className={styles.select}>
              <option value="all">All terrains</option>
              {terrains.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* MAIN */}
          <div className={styles.shell}>
            <div className={styles.grid}>
              {filtered.map(p => {
                const id = extractId(p.url);
                const active = selectedId === id;

                return (
                  <button
                    key={id}
                    className={`${styles.card} ${active ? styles.active : ""}`}
                    onClick={() => setSelectedId(id)}
                  >
                    <div
                        className={styles.planetVisual}
                        style={{ ["--planet-color" as any]: getPlanetColor(p.climate) }}
                    >
                        {hasRings(p) && <div className={styles.ring} />}
                        {hasMoon(p) && <div className={styles.moonOrbit}>
                            <div className={styles.moon} />
                    </div>}
                    </div>

                    <div className={styles.cardContent}>
                      <h3>{p.name}</h3>
                      <p>{p.climate}</p>
                      <span>{formatPopulation(p.population)}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* SIDE PANEL */}
            <aside className={styles.panel}>
              {selected && (
                <>
                  <h2>{selected.name}</h2>

                  <div className={styles.meta}>
                    <div><span>Climate</span><strong>{selected.climate}</strong></div>
                    <div><span>Terrain</span><strong>{selected.terrain}</strong></div>
                    <div><span>Population</span><strong>{formatPopulation(selected.population)}</strong></div>
                    <div><span>Gravity</span><strong>{selected.gravity}</strong></div>
                    <div><span>Diameter</span><strong>{selected.diameter}</strong></div>
                  </div>

                  <Link href={`/planets/${extractId(selected.url)}`} className={styles.button}>
                    Open Full Record
                  </Link>
                </>
              )}
            </aside>
          </div>
        </div>
      </ContentContainer>
    </PageWrapper>
  );
}