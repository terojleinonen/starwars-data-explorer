"use client";

import styles from "./DetailsDataTable.module.css";

type DetailsDataTableProps = {
  data: Record<string, any>;
  exclude?: string[];
};

function formatLabel(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function DetailsDataTable({
  data,
  exclude = [],
}: DetailsDataTableProps) {
  const entries = Object.entries(data).filter(
    ([key, value]) =>
      !exclude.includes(key) &&
      typeof value !== "object" &&
      value !== null
  );

  if (entries.length === 0) return null;

  return (
    <div className={styles.table}>
      {entries.map(([key, value]) => (
        <div key={key} className={styles.row}>
          <span className={styles.label}>
            {formatLabel(key)}
          </span>
          <span className={styles.value}>
            {String(value)}
          </span>
        </div>
      ))}
    </div>
  );
}