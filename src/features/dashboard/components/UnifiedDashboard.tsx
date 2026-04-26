"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { HoloHeader } from "@/ui/HoloHeader";
import { PageWrapper } from "@/features/layout";

import FiltersToolbar from "./FiltersToolbar";
import { DashboardConfig } from "./types";

import styles from "../styles/UnifiedDashboard.module.css";

export default function UnifiedDashboard<T>({
  config,
}: {
  config: DashboardConfig<T>;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const {
    category,
    title,
    subtitle,
    records,
    extractId,
    matchesSearch,
    filters = [],
    sorts = [],
    renderCard,
    renderPanel,
    renderStats,
  } = config;

  /* =========================
     STATE (URL SAFE)
  ========================= */

  const [search, setSearch] = useState(() => params.get("search") ?? "");
  const [sort, setSort] = useState(() => params.get("sort") ?? "");

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [filterState, setFilterState] = useState<Record<string, string[]>>(
    () => {
      const initial: Record<string, string[]> = {};
      filters.forEach((f) => {
        const val = params.get(f.key);
        initial[f.key] = val ? val.split(",") : [];
      });
      return initial;
    }
  );

  /* =========================
     FILTER OPTIONS
  ========================= */

  const filterOptions = useMemo(() => {
    return filters.map((f) => ({
      ...f,
      options: f.getOptions(records),
      value: filterState[f.key] || [],
    }));
  }, [filters, records, filterState]);

  /* =========================
     FILTERING
  ========================= */

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (search && !matchesSearch(r, search)) return false;

      for (const f of filters) {
        const selected = filterState[f.key];
        if (selected?.length && !f.matches(r, selected)) return false;
      }

      return true;
    });
  }, [records, search, filters, filterState, matchesSearch]);

  /* =========================
     SORTING
  ========================= */

  const sorted = useMemo(() => {
    const opt = sorts.find((s) => s.value === sort);
    return opt ? [...filtered].sort(opt.compare) : filtered;
  }, [filtered, sort, sorts]);

  /* =========================
     SELECTION (NO EFFECT)
  ========================= */

  const effectiveSelectedId =
    selectedId ?? (sorted.length ? extractId(sorted[0]) : null);

  const selected = sorted.find(
    (r) => extractId(r) === effectiveSelectedId
  );

  /* =========================
     URL SYNC
  ========================= */

  function updateUrl(next: {
    search?: string;
    sort?: string;
    filters?: Record<string, string[]>;
  }) {
    const q = new URLSearchParams();

    if (next.search) q.set("search", next.search);
    if (next.sort) q.set("sort", next.sort);

    if (next.filters) {
      Object.entries(next.filters).forEach(([key, val]) => {
        if (val.length) q.set(key, val.join(","));
      });
    }

    router.replace(`?${q.toString()}`, { scroll: false });
  }

  /* =========================
     HANDLERS
  ========================= */

  function handleSearch(v: string) {
    setSearch(v);
    updateUrl({ search: v, sort, filters: filterState });
  }

  function handleSort(v: string) {
    setSort(v);
    updateUrl({ search, sort: v, filters: filterState });
  }

  function handleFilterChange(key: string, value: string[]) {
    const next = { ...filterState, [key]: value };
    setFilterState(next);

    updateUrl({ search, sort, filters: next });
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <PageWrapper>
      <div className={styles.page}>
        <HoloHeader
          category={category}
          title={title}
          subtitle={subtitle}
        />

        {/* STATS */}
        {renderStats?.(records, sorted)}

        {/* TOOLBAR */}
        <FiltersToolbar
          search={search}
          onSearch={handleSearch}
          filters={filterOptions.map((f) => ({
            key: f.key,
            label: f.label,
            value: f.value,
            options: f.options,
            onChange: (v) => handleFilterChange(f.key, v),
          }))}
          sort={sort}
          onSortChange={handleSort}
          sortOptions={sorts}
        />

        {/* LAYOUT */}
        <div className={styles.layout}>
          {/* CARDS */}
          <div className={styles.grid}>
            {sorted.map((r) => {
              const id = extractId(r);
              const active = id === effectiveSelectedId;

              return renderCard(r, active, () => setSelectedId(id));
            })}
          </div>

          {/* PANEL */}
          <div className={styles.panel}>
            {selected && renderPanel(selected)}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}