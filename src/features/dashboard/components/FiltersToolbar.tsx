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

type Props = {
  search: string;
  onSearch: (value: string) => void;
  filters?: FilterGroup[];
  sort?: string;
  onSortChange?: (value: string) => void;
  sortOptions?: SortOption[];
};

export default function FiltersToolbar({
  search,
  onSearch,
  filters = [],
  sort,
  onSortChange,
  sortOptions = [],
}: Props) {
  const [open, setOpen] = useState(false);

  const activeFilterCount = filters.reduce(
    (sum, filter) => sum + filter.value.length,
    0
  );

  function toggleFilter(group: FilterGroup, option: string) {
    const next = group.value.includes(option)
      ? group.value.filter((value) => value !== option)
      : [...group.value, option];

    group.onChange(next);
  }

  return (
    <div className={styles.root}>
      <div className={styles.bar}>
        <div className={styles.searchWrap}>
          <input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search archive..."
            className={styles.search}
          />
        </div>

        <div className={styles.controls}>
          {sortOptions.length > 0 && onSortChange && (
            <select
              value={sort ?? ""}
              onChange={(event) => onSortChange(event.target.value)}
              className={styles.select}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}

          {filters.length > 0 && (
            <button
              type="button"
              className={styles.filterBtn}
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
            >
              Filters
              {activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </button>
          )}
        </div>
      </div>

      {open && filters.length > 0 && (
        <div className={styles.popover}>
          {filters.map((group) => (
            <div key={group.key} className={styles.group}>
              <span className={styles.groupTitle}>{group.label}</span>

              <div className={styles.chips}>
                {group.options.map((option) => {
                  const active = group.value.includes(option);

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleFilter(group, option)}
                      className={`${styles.chip} ${
                        active ? styles.activeChip : ""
                      }`}
                    >
                      {option}
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