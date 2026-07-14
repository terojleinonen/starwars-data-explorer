"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HoloHeader } from "@/ui/HoloHeader";
import { Button, Surface } from "@/ui";
import { PageWrapper } from "@/features/layout";
import FiltersToolbar from "./FiltersToolbar";
import { DashboardConfig } from "./types";
import PaginationBar from "@/features/navigation/components/PaginationBar";
import StatsBar from "./StatsBar";
import { ArchiveCharts } from "@/features/visualization";
import styles from "../styles/UnifiedDashboard.module.css";

type WorkspaceView = "explorer" | "gallery" | "analysis";

function recordTitle(record: unknown) {
  if (!record || typeof record !== "object") return "Untitled record";
  const item = record as Record<string, unknown>;
  return String(item.name ?? item.title ?? "Untitled record");
}

function recordMeta(record: unknown) {
  if (!record || typeof record !== "object") return [];
  const item = record as Record<string, unknown>;
  const preferred = [
    "model", "classification", "starship_class", "vehicle_class", "climate",
    "terrain", "gender", "birth_year", "manufacturer", "language", "director",
  ];
  return preferred
    .filter((key) => item[key] && item[key] !== "unknown" && item[key] !== "n/a")
    .slice(0, 2)
    .map((key) => ({ label: key.replaceAll("_", " "), value: String(item[key]) }));
}

export default function UnifiedDashboard<T>({ config }: { config: DashboardConfig<T> }) {
  const router = useRouter();
  const params = useSearchParams();
  const listRef = useRef<HTMLDivElement>(null);

  const { category, title, subtitle, records, extractId, matchesSearch, filters = [], sorts = [], renderCard, renderPanel } = config;

  const [search, setSearch] = useState(() => params.get("search") ?? "");
  const [sort, setSort] = useState(() => params.get("sort") ?? "");
  const [page, setPage] = useState(() => Math.max(1, Number(params.get("page") ?? "1")));
  const [view, setView] = useState<WorkspaceView>(() => {
    const value = params.get("view");
    return value === "gallery" || value === "analysis" ? value : "explorer";
  });
  const [selectedId, setSelectedId] = useState<string | null>(() => params.get("selected"));
  const [filterState, setFilterState] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    filters.forEach((filter) => {
      const value = params.get(filter.key);
      initial[filter.key] = value ? value.split(",") : [];
    });
    return initial;
  });

  const PAGE_SIZE = view === "explorer" ? 18 : 12;

  const filterOptions = useMemo(() => filters.map((filter) => ({
    ...filter,
    options: filter.getOptions(records),
    value: filterState[filter.key] || [],
  })), [filters, records, filterState]);

  const filtered = useMemo(() => records.filter((record) => {
    if (search && !matchesSearch(record, search)) return false;
    return filters.every((filter) => {
      const selected = filterState[filter.key];
      return !selected?.length || filter.matches(record, selected);
    });
  }), [records, search, filters, filterState, matchesSearch]);

  const sorted = useMemo(() => {
    const option = sorts.find((candidate) => candidate.value === sort);
    return option ? [...filtered].sort(option.compare) : filtered;
  }, [filtered, sort, sorts]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(() => sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE), [sorted, currentPage, PAGE_SIZE]);

  const effectiveSelectedId = selectedId && sorted.some((record) => extractId(record) === selectedId)
    ? selectedId
    : paginated[0] ? extractId(paginated[0]) : null;
  const selected = sorted.find((record) => extractId(record) === effectiveSelectedId);

  function updateUrl(next: {
    search?: string;
    sort?: string;
    page?: number;
    view?: WorkspaceView;
    selected?: string | null;
    filters?: Record<string, string[]>;
  }) {
    const query = new URLSearchParams();
    if (next.search) query.set("search", next.search);
    if (next.sort) query.set("sort", next.sort);
    if ((next.page ?? 1) > 1) query.set("page", String(next.page));
    if ((next.view ?? "explorer") !== "explorer") query.set("view", next.view!);
    if (next.selected) query.set("selected", next.selected);
    Object.entries(next.filters ?? {}).forEach(([key, values]) => {
      if (values.length) query.set(key, values.join(","));
    });
    router.replace(query.size ? `?${query.toString()}` : "?", { scroll: false });
  }

  function sync(overrides: Partial<{ search: string; sort: string; page: number; view: WorkspaceView; selected: string | null; filters: Record<string, string[]> }>) {
    updateUrl({ search, sort, page, view, selected: effectiveSelectedId, filters: filterState, ...overrides });
  }

  function selectRecord(id: string) {
    setSelectedId(id);
    sync({ selected: id });
  }

  function changeView(next: WorkspaceView) {
    setView(next);
    setPage(1);
    sync({ view: next, page: 1 });
  }



  function handleListKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!paginated.length || (event.key !== "ArrowDown" && event.key !== "ArrowUp")) return;
    event.preventDefault();
    const index = Math.max(0, paginated.findIndex((record) => extractId(record) === effectiveSelectedId));
    const nextIndex = event.key === "ArrowDown" ? Math.min(paginated.length - 1, index + 1) : Math.max(0, index - 1);
    selectRecord(extractId(paginated[nextIndex]));
    listRef.current?.querySelectorAll<HTMLButtonElement>("button[data-record]")[nextIndex]?.focus();
  }

  const stats = config.getStats?.(records, filtered) ?? [];

  return (
    <PageWrapper>
      <div className={styles.page}>
        <HoloHeader category={category} title={title} subtitle={subtitle} />
        <StatsBar stats={stats} />

        <Surface material="plate" elevation={1} padding="sm" className={styles.workspaceBar}>
          <div>
            <p className={styles.eyebrow}>Archive workspace</p>
            <p className={styles.status} aria-live="polite">
              {filtered.length} of {records.length} records · page {currentPage} of {totalPages}
            </p>
          </div>
          <div className={styles.viewSwitch} aria-label="Workspace view">
            {(["explorer", "gallery", "analysis"] as WorkspaceView[]).map((option) => (
              <Button key={option} size="sm" variant={view === option ? "primary" : "quiet"} aria-pressed={view === option} onClick={() => changeView(option)}>
                {option}
              </Button>
            ))}
          </div>
        </Surface>

        <FiltersToolbar
          search={search}
          onSearch={(value) => { setSearch(value); setPage(1); sync({ search: value, page: 1 }); }}
          filters={filterOptions.map((filter) => ({
            key: filter.key,
            label: filter.label,
            value: filter.value,
            options: filter.options,
            onChange: (value) => {
              const next = { ...filterState, [filter.key]: value };
              setFilterState(next);
              setPage(1);
              sync({ filters: next, page: 1 });
            },
          }))}
          sort={sort}
          onSortChange={(value) => { setSort(value); setPage(1); sync({ sort: value, page: 1 }); }}
          sortOptions={sorts}
        />

        {!paginated.length ? (
          <Surface material="paper" elevation={1} padding="lg" className={styles.empty}>
            <p className={styles.eyebrow}>No matching records</p>
            <h2>The archive returned no results.</h2>
            <p>Adjust the query or remove one of the active filters.</p>
            <Button variant="secondary" onClick={() => {
              const cleared = Object.fromEntries(filters.map((filter) => [filter.key, []]));
              setSearch(""); setSort(""); setFilterState(cleared); setPage(1);
              updateUrl({ page: 1, view, selected: null, filters: cleared });
            }}>Reset workspace</Button>
          </Surface>
        ) : view === "explorer" ? (
          <div className={styles.explorerLayout}>
            <Surface material="glass" elevation={1} padding="none" className={styles.recordIndex}>
              <div className={styles.indexHeader}><span>Record</span><span>Classification</span></div>
              <div ref={listRef} role="listbox" aria-label={`${title} records`} onKeyDown={handleListKeyDown}>
                {paginated.map((record, index) => {
                  const id = extractId(record);
                  const active = id === effectiveSelectedId;
                  const meta = recordMeta(record);
                  return (
                    <button
                      key={id}
                      data-record
                      role="option"
                      aria-selected={active}
                      className={`${styles.recordRow} ${active ? styles.recordRowActive : ""}`}
                      onClick={() => selectRecord(id)}
                    >
                      <span className={styles.recordNumber}>{String((currentPage - 1) * PAGE_SIZE + index + 1).padStart(3, "0")}</span>
                      <span className={styles.recordIdentity}><strong>{recordTitle(record)}</strong><small>{meta[0]?.value ?? category}</small></span>
                      <span className={styles.recordClass}>{meta[1]?.value ?? meta[0]?.label ?? "archive entry"}</span>
                      <span className={styles.rowSignal} aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
            </Surface>
            <aside className={styles.panel}>{selected && renderPanel(selected)}</aside>
          </div>
        ) : view === "gallery" ? (
          <div className={styles.galleryLayout}>
            <div className={styles.grid}>{paginated.map((record) => {
              const id = extractId(record);
              return renderCard(record, id === effectiveSelectedId, () => selectRecord(id));
            })}</div>
            <aside className={styles.panel}>{selected && renderPanel(selected)}</aside>
          </div>
        ) : (
          <div className={styles.analysisLayout}>
            <Surface material="paper" elevation={1} padding="lg" className={styles.analysisHero}>
              <p className={styles.eyebrow}>Current result set</p>
              <strong>{filtered.length}</strong>
              <span>records available for analysis</span>
              <div className={styles.coverage}><i style={{ width: `${records.length ? (filtered.length / records.length) * 100 : 0}%` }} /></div>
              <small>{records.length ? Math.round((filtered.length / records.length) * 100) : 0}% archive coverage</small>
            </Surface>
            <ArchiveCharts category={category} records={filtered as unknown[]} selectedName={selected ? recordTitle(selected) : undefined} />
          </div>
        )}

        {view !== "analysis" && <PaginationBar page={currentPage} totalPages={totalPages} onChange={(nextPage) => { setPage(nextPage); sync({ page: nextPage }); }} />}
      </div>
    </PageWrapper>
  );
}
