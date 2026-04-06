"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HoloHeader } from "@/ui/HoloHeader";
import { PageWrapper } from "@/features/layout";
import ContentContainer from "@/features/layout/components/ContentContainer";
import { useSwapi } from "@/hooks/data/useSwapi";
import { setNavContext } from "@/lib/navigation/navigationContext";
import styles from "../styles/StarshipsDashboard.module.css";

type Starship = {
  name: string;
  starship_class: string;
  manufacturer: string;
  max_atmosphering_speed: string;
  hyperdrive_rating: string;
  crew: string;
  passengers: string;
  url: string;
};

type SortKey =
  | "name-asc"
  | "name-desc"
  | "speed-asc"
  | "speed-desc"
  | "hyper-asc"
  | "hyper-desc";

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

function averageSpeed(records: Starship[]): string {
  const values = records
    .map((r) => numericOrNull(r.max_atmosphering_speed))
    .filter((v): v is number => v !== null);

  if (!values.length) return "—";

  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  return String(avg);
}

function averageHyperdrive(records: Starship[]): string {
  const values = records
    .map((r) => numericOrNull(r.hyperdrive_rating))
    .filter((v): v is number => v !== null);

  if (!values.length) return "—";

  const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
  return avg;
}

export default function StarshipsDashboard() {
  const router = useRouter();
  const { data, loading, error } = useSwapi("starships");
  const records = (data?.results ?? []) as Starship[];

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("name-asc");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setNavContext("starships", "/starships");
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

        case "hyper-asc": {
          const av = numericOrNull(a.hyperdrive_rating);
          const bv = numericOrNull(b.hyperdrive_rating);
          if (av === null && bv === null) return 0;
          if (av === null) return 1;
          if (bv === null) return -1;
          return av - bv;
        }

        case "hyper-desc": {
          const av = numericOrNull(a.hyperdrive_rating);
          const bv = numericOrNull(b.hyperdrive_rating);
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
  const avgHyper = averageHyperdrive(records);

  return (
    <PageWrapper>
      <ContentContainer>
        <div className={styles.page}>
          <HoloHeader
            category="starships"
            title="Starship Intelligence"
            subtitle="Engineering specs and fleet analysis"
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
              <span className={styles.statLabel}>Avg Hyperdrive</span>
              <strong className={styles.statValue}>{avgHyper}</strong>
            </div>
          </section>

          {/* CONTROLS */}
          <section className={styles.controls}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search starships..."
              className={styles.searchInput}
            />

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className={styles.select}
            >
              <option value="name-asc">Sort: Name A–Z</option>
              <option value="name-desc">Sort: Name Z–A</option>
              <option value="speed-asc">Sort: Speed Low–High</option>
              <option value="speed-desc">Sort: Speed High–Low</option>
              <option value="hyper-asc">Sort: Hyperdrive Low–High</option>
              <option value="hyper-desc">Sort: Hyperdrive High–Low</option>
            </select>
          </section>

          {/* MAIN */}
          <section className={styles.dashboardShell}>
            <div className={styles.tablePanel}>
              <div className={styles.tableHead}>
                <span>Name</span>
                <span>Class</span>
                <span>Speed</span>
                <span>Hyperdrive</span>
              </div>

              <div className={styles.tableBody}>
                {loading && <div className={styles.stateMessage}>Scanning fleet...</div>}
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
                        onDoubleClick={() => router.push(`/starships/${id}`)}
                      >
                        <span className={styles.primaryCell}>{r.name}</span>
                        <span>{r.starship_class}</span>
                        <span>{displayValue(r.max_atmosphering_speed)}</span>
                        <span>{displayValue(r.hyperdrive_rating)}</span>
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
                      <span>Class</span>
                      <strong>{selected.starship_class}</strong>
                    </div>
                    <div className={styles.factRow}>
                      <span>Manufacturer</span>
                      <strong>{displayValue(selected.manufacturer)}</strong>
                    </div>
                    <div className={styles.factRow}>
                      <span>Speed</span>
                      <strong>{displayValue(selected.max_atmosphering_speed)}</strong>
                    </div>
                    <div className={styles.factRow}>
                      <span>Hyperdrive</span>
                      <strong>{displayValue(selected.hyperdrive_rating)}</strong>
                    </div>
                    <div className={styles.factRow}>
                      <span>Crew</span>
                      <strong>{displayValue(selected.crew)}</strong>
                    </div>
                    <div className={styles.factRow}>
                      <span>Passengers</span>
                      <strong>{displayValue(selected.passengers)}</strong>
                    </div>
                  </div>

                  <Link
                    href={`/starships/${extractId(selected.url)}`}
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