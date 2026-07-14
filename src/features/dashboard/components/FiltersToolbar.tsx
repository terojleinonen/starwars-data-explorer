"use client";

import { useState } from "react";
import { Button, Chip, SelectField, Surface, TextField } from "@/ui";
import styles from "../styles/FiltersToolbar.module.css";

type FilterGroup = { key: string; label: string; value: string[]; options: string[]; onChange: (value: string[]) => void };
type SortOption = { label: string; value: string };
type Props = { search: string; onSearch: (value: string) => void; filters?: FilterGroup[]; sort?: string; onSortChange?: (value: string) => void; sortOptions?: SortOption[] };

export default function FiltersToolbar({ search, onSearch, filters = [], sort, onSortChange, sortOptions = [] }: Props) {
  const [open, setOpen] = useState(false);
  const activeFilterCount = filters.reduce((sum, filter) => sum + filter.value.length, 0);
  const toggleFilter = (group: FilterGroup, option: string) => group.onChange(group.value.includes(option) ? group.value.filter((value) => value !== option) : [...group.value, option]);

  return (
    <div className={styles.root}>
      <Surface material="glass" elevation={1} padding="sm" className={styles.bar}>
        <TextField aria-label="Search archive" value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search archive records…" />
        <div className={styles.controls}>
          {sortOptions.length > 0 && onSortChange && (
            <SelectField aria-label="Sort records" value={sort ?? ""} onChange={(event) => onSortChange(event.target.value)}>
              {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </SelectField>
          )}
          {filters.length > 0 && (
            <Button variant={open || activeFilterCount ? "secondary" : "plate"} size="lg" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
              Filters {activeFilterCount > 0 && <span className={styles.count}>{activeFilterCount}</span>}
            </Button>
          )}
        </div>
      </Surface>

      {open && filters.length > 0 && (
        <Surface material="paper" elevation={2} padding="md" className={styles.popover}>
          {filters.map((group) => (
            <fieldset key={group.key} className={styles.group}>
              <legend className={styles.groupTitle}>{group.label}</legend>
              <div className={styles.chips}>
                {group.options.map((option) => <Chip key={option} active={group.value.includes(option)} onClick={() => toggleFilter(group, option)}>{option}</Chip>)}
              </div>
            </fieldset>
          ))}
        </Surface>
      )}
    </div>
  );
}
