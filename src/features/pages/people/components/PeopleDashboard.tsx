"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HoloHeader } from "@/ui/HoloHeader";
import { PageWrapper } from "@/features/layout";
import ContentContainer from "@/features/layout/components/ContentContainer";
import { useSwapi } from "@/hooks/data/useSwapi";
import { setNavContext } from "@/lib/navigation/navigationContext";
import styles from "../styles/PeopleDashboard.module.css";

type SwapiPerson = {
  name: string;
  gender: string;
  birth_year: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  homeworld?: string;
  films?: string[];
  species?: string[];
  starships?: string[];
  vehicles?: string[];
  url: string;
};

type SortKey =
  | "name-asc"
  | "name-desc"
  | "height-asc"
  | "height-desc"
  | "birth-asc"
  | "birth-desc";

function extractId(url: string): string {
  const match = url.match(/\/(\d+)\/?$/);
  return match?.[1] ?? "";
}

function normalizeGender(value: string): string {
  if (!value) return "Unknown";
  if (value === "n/a") return "N/A";
  if (value === "none") return "None";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function displayValue(value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === "") return "—";
  const str = String(value);
  if (str === "unknown") return "Unknown";
  if (str === "n/a") return "N/A";
  return str;
}

function numericOrNull(value: string): number | null {
  if (!value || value === "unknown" || value === "n/a") return null;
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function birthYearSortable(value: string): number | null {
  if (!value || value === "unknown") return null;
  const match = value.match(/^([\d.]+)\s*(BBY|ABY)$/i);
  if (!match) return null;

  const amount = Number(match[1]);
  const era = match[2].toUpperCase();

  if (!Number.isFinite(amount)) return null;

  return era === "BBY" ? -amount : amount;
}

function averageHeight(records: SwapiPerson[]): string {
  const values = records
    .map((person) => numericOrNull(person.height))
    .filter((v): v is number => v !== null);

  if (!values.length) return "—";

  const avg = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  return `${avg} cm`;
}

function mostCommonGender(records: SwapiPerson[]): string {
  const counts = new Map<string, number>();

  for (const record of records) {
    const gender = normalizeGender(record.gender);
    counts.set(gender, (counts.get(gender) ?? 0) + 1);
  }

  let best = "—";
  let max = 0;

  for (const [key, count] of Array.from(counts.entries())) {
    if (count > max) {
      best = key;
      max = count;
    }
  }

  return best;
}

export default function PeopleDashboard() {
  const router = useRouter();
  const { data, loading, error } = useSwapi("people");
  const records = (data?.results ?? []) as SwapiPerson[];

  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [sort, setSort] = useState<SortKey>("name-asc");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setNavContext("people", "/people");
  }, []);

  const filtered = useMemo(() => {
    let next = [...records];

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      next = next.filter((person) => person.name.toLowerCase().includes(query));
    }

    if (genderFilter !== "all") {
      next = next.filter((person) => normalizeGender(person.gender).toLowerCase() === genderFilter);
    }

    next.sort((a, b) => {
      switch (sort) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "height-asc": {
          const av = numericOrNull(a.height);
          const bv = numericOrNull(b.height);
          if (av === null && bv === null) return 0;
          if (av === null) return 1;
          if (bv === null) return -1;
          return av - bv;
        }
        case "height-desc": {
          const av = numericOrNull(a.height);
          const bv = numericOrNull(b.height);
          if (av === null && bv === null) return 0;
          if (av === null) return 1;
          if (bv === null) return -1;
          return bv - av;
        }
        case "birth-asc": {
          const av = birthYearSortable(a.birth_year);
          const bv = birthYearSortable(b.birth_year);
          if (av === null && bv === null) return 0;
          if (av === null) return 1;
          if (bv === null) return -1;
          return av - bv;
        }
        case "birth-desc": {
          const av = birthYearSortable(a.birth_year);
          const bv = birthYearSortable(b.birth_year);
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
  }, [records, search, genderFilter, sort]);

  useEffect(() => {
    if (!filtered.length) {
      setSelectedId(null);
      return;
    }

    if (!selectedId || !filtered.some((item) => extractId(item.url) === selectedId)) {
      setSelectedId(extractId(filtered[0].url));
    }
  }, [filtered, selectedId]);

  const selected = useMemo(() => {
    return filtered.find((person) => extractId(person.url) === selectedId) ?? null;
  }, [filtered, selectedId]);

  const totalCount = records.length;
  const visibleCount = filtered.length;
  const avgHeight = averageHeight(records);
  const commonGender = mostCommonGender(records);

  return (
    <PageWrapper>
      <ContentContainer>
        <div className={styles.page}>
          <HoloHeader
            category="people"
            title="People Intelligence"
            subtitle="Search, filter, compare, and inspect sentient archive records"
          />

          <section className={styles.statsRow} aria-label="People dashboard statistics">
            <article className={styles.statCard}>
              <span className={styles.statLabel}>Total Records</span>
              <strong className={styles.statValue}>{totalCount}</strong>
            </article>

            <article className={styles.statCard}>
              <span className={styles.statLabel}>Visible Results</span>
              <strong className={styles.statValue}>{visibleCount}</strong>
            </article>

            <article className={styles.statCard}>
              <span className={styles.statLabel}>Average Height</span>
              <strong className={styles.statValue}>{avgHeight}</strong>
            </article>

            <article className={styles.statCard}>
              <span className={styles.statLabel}>Common Gender</span>
              <strong className={styles.statValue}>{commonGender}</strong>
            </article>
          </section>

          <section className={styles.controls} aria-label="People dashboard controls">
            <div className={styles.searchWrap}>
              <label htmlFor="people-search" className={styles.visuallyHidden}>
                Search people
              </label>
              <input
                id="people-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search people..."
                className={styles.searchInput}
              />
            </div>

            <div className={styles.selectWrap}>
              <label htmlFor="people-gender" className={styles.visuallyHidden}>
                Filter by gender
              </label>
              <select
                id="people-gender"
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className={styles.select}
              >
                <option value="all">All genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="n/a">N/A</option>
                <option value="none">None</option>
                <option value="hermaphrodite">Hermaphrodite</option>
              </select>
            </div>

            <div className={styles.selectWrap}>
              <label htmlFor="people-sort" className={styles.visuallyHidden}>
                Sort people
              </label>
              <select
                id="people-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className={styles.select}
              >
                <option value="name-asc">Sort: Name A–Z</option>
                <option value="name-desc">Sort: Name Z–A</option>
                <option value="height-asc">Sort: Height Low–High</option>
                <option value="height-desc">Sort: Height High–Low</option>
                <option value="birth-asc">Sort: Birth Earliest</option>
                <option value="birth-desc">Sort: Birth Latest</option>
              </select>
            </div>
          </section>

          <section className={styles.dashboardShell}>
            <div className={styles.tablePanel}>
              <div className={styles.tableHead}>
                <span>Name</span>
                <span>Gender</span>
                <span>Birth Year</span>
                <span>Height</span>
              </div>

              <div className={styles.tableBody}>
                {loading && <div className={styles.stateMessage}>Scanning archive records...</div>}
                {error && <div className={styles.stateMessage}>Transmission error. Unable to load people data.</div>}

                {!loading && !error && filtered.length === 0 && (
                  <div className={styles.stateMessage}>No matching records in archive.</div>
                )}

                {!loading &&
                  !error &&
                  filtered.map((person) => {
                    const id = extractId(person.url);
                    const active = selectedId === id;

                    return (
                      <button
                        key={id}
                        type="button"
                        className={`${styles.rowButton} ${active ? styles.rowButtonActive : ""}`}
                        onClick={() => setSelectedId(id)}
                        onDoubleClick={() => router.push(`/people/${id}`)}
                      >
                        <span className={styles.primaryCell}>{person.name}</span>
                        <span>{normalizeGender(person.gender)}</span>
                        <span>{displayValue(person.birth_year)}</span>
                        <span>
                          {numericOrNull(person.height) !== null
                            ? `${person.height} cm`
                            : displayValue(person.height)}
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>

            <aside className={styles.previewPanel} aria-label="Selected person preview">
              {selected ? (
                <>
                  <div className={styles.previewTop}>
                    <p className={styles.previewEyebrow}>Selected Record</p>
                    <h2 className={styles.previewTitle}>{selected.name}</h2>
                  </div>

                  <div className={styles.previewFacts}>
                    <div className={styles.factRow}>
                      <span>Gender</span>
                      <strong>{normalizeGender(selected.gender)}</strong>
                    </div>
                    <div className={styles.factRow}>
                      <span>Birth Year</span>
                      <strong>{displayValue(selected.birth_year)}</strong>
                    </div>
                    <div className={styles.factRow}>
                      <span>Height</span>
                      <strong>
                        {numericOrNull(selected.height) !== null
                          ? `${selected.height} cm`
                          : displayValue(selected.height)}
                      </strong>
                    </div>
                    <div className={styles.factRow}>
                      <span>Mass</span>
                      <strong>
                        {numericOrNull(selected.mass) !== null
                          ? `${selected.mass} kg`
                          : displayValue(selected.mass)}
                      </strong>
                    </div>
                    <div className={styles.factRow}>
                      <span>Hair</span>
                      <strong>{displayValue(selected.hair_color)}</strong>
                    </div>
                    <div className={styles.factRow}>
                      <span>Eyes</span>
                      <strong>{displayValue(selected.eye_color)}</strong>
                    </div>
                    <div className={styles.factRow}>
                      <span>Skin</span>
                      <strong>{displayValue(selected.skin_color)}</strong>
                    </div>
                    <div className={styles.factRow}>
                      <span>Films</span>
                      <strong>{selected.films?.length ?? 0}</strong>
                    </div>
                    <div className={styles.factRow}>
                      <span>Vehicles</span>
                      <strong>{selected.vehicles?.length ?? 0}</strong>
                    </div>
                    <div className={styles.factRow}>
                      <span>Starships</span>
                      <strong>{selected.starships?.length ?? 0}</strong>
                    </div>
                  </div>

                  <Link
                    href={`/people/${extractId(selected.url)}`}
                    className={styles.profileLink}
                    onMouseEnter={() => router.prefetch(`/people/${extractId(selected.url)}`)}
                  >
                    Open Full Record
                  </Link>
                </>
              ) : (
                <div className={styles.stateMessage}>No selected record.</div>
              )}
            </aside>
          </section>
        </div>
      </ContentContainer>
    </PageWrapper>
  );
}