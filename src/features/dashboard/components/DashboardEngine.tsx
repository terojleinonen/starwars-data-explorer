"use client";

import { useMemo, useState, useCallback } from "react";
import styles from "../styles/DashboardEngine.module.css";

type Props<T> = {
  records: T[];
  extractId: (item: T) => string;
  filterFn?: (item: T, search: string) => boolean;
  renderCard: (...args: any) => React.ReactNode;
  renderPanel: (item: T) => React.ReactNode;
  toolbar?: React.ReactNode; // 👈 NEW
};

export default function DashboardEngine<T>({
  records,
  extractId,
  filterFn,
  renderCard,
  renderPanel,
  toolbar
}: Props<T>) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!filterFn) return records;
    return records.filter((r) => filterFn(r, search));
  }, [records, search, filterFn]);

  const effectiveSelectedId = useMemo(() => {
    if (selectedId) return selectedId;
    if (!filtered.length) return null;
    return extractId(filtered[0]);
  }, [selectedId, filtered, extractId]);

  const selected = useMemo(() => {
    return filtered.find((r) => extractId(r) === effectiveSelectedId);
  }, [filtered, effectiveSelectedId, extractId]);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  return (
    <div className={styles.root}>
      {/* SEARCH */}
      {toolbar && <div className={styles.toolbar}>{toolbar}</div>}

      <div className={styles.shell}>
        {/* GRID */}
        <div className={styles.grid}>
          {filtered.map((item) => {
            const id = extractId(item);
            const active = id === effectiveSelectedId;

            return renderCard(item, active, () => handleSelect(id));
          })}
        </div>

        {/* PANEL */}
        <aside className={styles.panel}>
          {selected && renderPanel(selected)}
        </aside>
      </div>
    </div>
  );
}