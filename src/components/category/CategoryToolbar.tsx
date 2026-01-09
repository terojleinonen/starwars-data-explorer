"use client";

import styles from "./CategoryToolbar.module.css";
import type { SortKey } from "@/hooks/useRecordQuery";

type Props = {
  query: string;
  onQueryChange: (v: string) => void;
  sortKey: SortKey;
  onSortChange: (v: SortKey) => void;
};

export default function CategoryToolbar({
  query,
  onQueryChange,
  sortKey,
  onSortChange,
}: Props) {
  return (
    <div className={styles.toolbar}>
      <input
        className={styles.search}
        type="search"
        placeholder="Search records…"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        aria-label="Search records"
      />

      <select
        className={styles.sort}
        value={sortKey}
        onChange={(e) =>
          onSortChange(e.target.value as SortKey)
        }
        aria-label="Sort records"
      >
        <option value="name">Sort by name</option>
        <option value="id">Sort by ID</option>
      </select>
    </div>
  );
}