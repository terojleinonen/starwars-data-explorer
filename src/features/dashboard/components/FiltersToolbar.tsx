"use client";

import { useState } from "react";
import styles from "../styles/FiltersToolbar.module.css";

type FilterGroup = {
  key: string;
  label: string;
  value: string[];
  options: string[];
  onChange: (value: string[]) => void;
};

type SortOption = {
  label: string;
  value: string;
};

export default function FiltersToolbar({
  search,
  onSearch,
  filters,
  sort,
  onSortChange,
  sortOptions,
}: {
  search: string;
  onSearch: (v: string) => void;
  filters: FilterGroup[];
  sort: string;
  onSortChange: (v: string) => void;
  sortOptions: SortOption[];
}) {
  const [open, setOpen] = useState(false);

  function toggleFilter(group: FilterGroup, option: string) {
    const exists = group.value.includes(option);

    const next = exists
      ? group.value.filter((v) => v !== option)
      : [...group.value, option];

    group.onChange(next);
  }

  return (
    <div className={styles.toolbar}>
      {/* LEFT */}
      <div className={styles.left}>
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search..."
          className={styles.search}
        />
      </div>

      {/* RIGHT */}
      <div className={styles.right}>
        {/* SORT */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className={styles.sort}
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* FILTER BUTTON */}
        <button
          className={styles.filterBtn}
          onClick={() => setOpen((v) => !v)}
        >
          Filters
        </button>
      </div>

      {/* POPOVER */}
      {open && (
        <div className={styles.popover}>
          {filters.map((group) => (
            <div key={group.key} className={styles.group}>
              <span className={styles.groupTitle}>
                {group.label}
              </span>

              <div className={styles.options}>
                {group.options.map((opt) => {
                  const active = group.value.includes(opt);

                  return (
                    <button
                      key={opt}
                      onClick={() => toggleFilter(group, opt)}
                      className={`${styles.option} ${
                        active ? styles.active : ""
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}