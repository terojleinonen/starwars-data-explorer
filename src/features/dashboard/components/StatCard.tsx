"use client";

import styles from "../styles/StatCard.module.css";

type Props = {
  label: string;
  value: string | number;
  hint?: string;
  featured?: boolean;
};

export default function StatCard({
  label,
  value,
  hint,
  featured = false,
}: Props) {
  return (
    <div
      className={`${styles.card} ${
        featured ? styles.featured : ""
      }`}
    >
      <div className={styles.label}>
        {label}
      </div>

      <div className={styles.value}>
        {value == null ||
          Number.isNaN(value)
          ? "—"
          : value}
      </div>
      
      {hint && (
        <div className={styles.hint}>
          {hint}
        </div>
      )}
    </div>
  );
}