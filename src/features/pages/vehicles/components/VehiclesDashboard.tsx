"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HoloHeader } from "@/ui/HoloHeader";
import { PageWrapper } from "@/features/layout";
import ContentContainer from "@/features/layout/components/ContentContainer";
import { useSwapi } from "@/hooks/data/useSwapi";
import { setNavContext } from "@/lib/navigation/navigationContext";
import styles from "../styles/VehiclesDashboard.module.css";

type Vehicle = {
  name: string;
  model: string;
  vehicle_class: string;
  manufacturer: string;
  crew: string;
  passengers: string;
  max_atmosphering_speed: string;
  url: string;
};

type SortKey =
  | "name-asc"
  | "name-desc"
  | "crew-asc"
  | "crew-desc"
  | "speed-asc"
  | "speed-desc";

function extractId(url: string): string {
  const match = url.match(/\/(\d+)\/?$/);
  return match?.[1] ?? "";
}

function numericOrNull(value: string): number | null {
  if (!value || value === "unknown" || value === "n/a") return null;
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function displayValue(value: string | number | undefined | null): string {
  if (!value || value === "unknown") return "—";
  return String(value);
}

function averageSpeed(records: Vehicle[]): string {
  const values = records
    .map((r) => numericOrNull(r.max_atmosphering_speed))
    .filter((v): v is number => v !== null);

  if (!values.length) return "—";

  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  return String(avg);
}

function averageCrew(records: Vehicle[]): string {
  const values = records
    .map((r) => numericOrNull(r.crew))
    .filter((v): v is number => v !== null);

  if (!values.length) return "—";

  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  return String(avg);
}

export default function VehiclesDashboard() {
  const router = useRouter();
  const { data, loading, error } = useSwapi("vehicles");
  const records = (data?.results ?? []) as Vehicle[];

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("name-asc");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setNavContext("vehicles", "/vehicles");
  }, []);

  const filtered = useMemo(() => {
    let next = [...records];

    if (search.trim()) {
      const query = search.toLowerCase();
      next = next.filter((r) => r.name.toLowerCase().includes(query));
    }

    next.sort((a, b) => {
      switch (sort) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);

        case "crew-asc": {
          const av = numericOrNull(a.crew);
          const bv = numericOrNull(b.crew);
          if (av === null && bv === null) return 0;
          if (av === null) return 1;
          if (bv === null) return -1;
          return av - bv;
        }

        case "crew-desc": {
          const av = numericOrNull(a.crew);
          const bv = numericOrNull(b.crew);
          if (av === null && bv === null) return 0;
          if (av === null) return 1;
          if (bv === null) return -1;
          return bv - av;
        }

        case "speed-asc": {
          const av = numericOrNull(a.max_atmosphering_speed);
          const bv = numericOrNull(b.max_atmosphering_speed);
          if (av === null && bv === null) return 0;
          if (av === null) return 1;
          if (bv === null) return -1;
          return av - bv;
        }

        case "speed-desc": {
          const av = numericOrNull(a.max_atmosphering_speed);
          const bv = numericOrNull(b.max_atmosphering_speed);
          if (av === null && bv === null) return 0;
          if (av === null) return 1;
          if (bv === null) return -1;
          return bv - av;
        }

        default:
          return 0;
      }
    });

    return next;
  }, [records, search, sort]);

  useEffect(() => {
    if (!filtered.length) {
      setSelectedId(null);
      return;
    }

    if (!selectedId || !filtered.some((r) => extractId(r.url) === selectedId)) {
      setSelectedId(extractId(filtered[0].url));
    }
  }, [filtered, selectedId]);

  const selected = filtered.find((r) => extractId(r.url) === selectedId) ?? null;

  const totalCount = records.length;
  const visibleCount = filtered.length;
  const avgSpeed = averageSpeed(records);
  const avgCrew = averageCrew(records);

  return (
    <PageWrapper>
      <ContentContainer>
        <div className={styles.page}>
          <HoloHeader
            category="vehicles"
            title="Vehicle Intelligence"
            subtitle="Ground and transport unit analysis"
          />

          {/* STATS */}
          <section className={styles.statsRow}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Total Records</span>
              <strong className={styles.statValue}>{totalCount}</strong>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statLabel}>Visible Results</span>
              <strong className={styles.statValue}>{visibleCount}</strong>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statLabel}>Avg Speed</span>
              <strong className={styles.statValue}>{avgSpeed}</strong>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statLabel}>Avg Crew</span>
              <strong className={styles.statValue}>{avgCrew}</strong>
            </div>
          </section>

          {/* CONTROLS */}
          <section className={styles.controls}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vehicles..."
              className={styles.searchInput}
            />

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className={styles.select}
            >
              <option value="name-asc">Sort: Name A–Z</option>
              <option value="name-desc">Sort: Name Z–A</option>
              <option value="crew-asc">Sort: Crew Low–High</option>
              <option value="crew-desc">Sort: Crew High–Low</option>
              <option value="speed-asc">Sort: Speed Low–High</option>
              <option value="speed-desc">Sort: Speed High–Low</option>
            </select>
          </section>

          {/* MAIN */}
          <section className={styles.dashboardShell}>
            <div className={styles.tablePanel}>
              <div className={styles.tableHead}>
                <span>Name</span>
                <span>Class</span>
                <span>Crew</span>
                <span>Speed</span>
              </div>

              <div className={styles.tableBody}>
                {loading && <div className={styles.stateMessage}>Scanning vehicles...</div>}
                {error && <div className={styles.stateMessage}>Transmission error.</div>}

                {!loading &&
                  !error &&
                  filtered.map((r) => {
                    const id = extractId(r.url);
                    const active = selectedId === id;

                    return (
                      <button
                        key={id}
                        className={`${styles.rowButton} ${active ? styles.rowButtonActive : ""}`}
                        onClick={() => setSelectedId(id)}
                        onDoubleClick={() => router.push(`/vehicles/${id}`)}
                      >
                        <span className={styles.primaryCell}>{r.name}</span>
                        <span>{r.vehicle_class}</span>
                        <span>{displayValue(r.crew)}</span>
                        <span>{displayValue(r.max_atmosphering_speed)}</span>
                      </button>
                    );
                  })}
              </div>
            </div>

            <aside className={styles.previewPanel}>
              {selected && (
                <>
                  <div className={styles.previewTop}>
                    <p className={styles.previewEyebrow}>Selected Record</p>
                    <h2 className={styles.previewTitle}>{selected.name}</h2>
                  </div>

                  <div className={styles.previewFacts}>
                    <div className={styles.factRow}>
                      <span>Model</span>
                      <strong>{displayValue(selected.model)}</strong>
                    </div>
                    <div className={styles.factRow}>
                      <span>Class</span>
                      <strong>{displayValue(selected.vehicle_class)}</strong>
                    </div>
                    <div className={styles.factRow}>
                      <span>Manufacturer</span>
                      <strong>{displayValue(selected.manufacturer)}</strong>
                    </div>
                    <div className={styles.factRow}>
                      <span>Crew</span>
                      <strong>{displayValue(selected.crew)}</strong>
                    </div>
                    <div className={styles.factRow}>
                      <span>Passengers</span>
                      <strong>{displayValue(selected.passengers)}</strong>
                    </div>
                    <div className={styles.factRow}>
                      <span>Speed</span>
                      <strong>{displayValue(selected.max_atmosphering_speed)}</strong>
                    </div>
                  </div>

                  <Link
                    href={`/vehicles/${extractId(selected.url)}`}
                    className={styles.profileLink}
                  >
                    Open Full Record
                  </Link>
                </>
              )}
            </aside>
          </section>
        </div>
      </ContentContainer>
    </PageWrapper>
  );
}