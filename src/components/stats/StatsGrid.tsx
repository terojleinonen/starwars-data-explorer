"use client";

import styles from "./StatsGrid.module.css";

export type StatValue = string | number | null | undefined;

export type Stat = {
  label: string;
  value: StatValue;
  unit?: string;
};

type Props = {
  stats: Stat[];
};

export default function StatsGrid({ stats }: Props) {
  if (!stats.length) return null;

  return (
    <section className={styles.section}>
      <h3 className={styles.heading}>
        Key Statistics
      </h3>

      <div className={styles.grid}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.card}>
            <span className={styles.label}>
              {stat.label}
            </span>

            <span className={styles.value}>
              {stat.value ?? "—"}
              {stat.unit && (
                <span className={styles.unit}>
                  {stat.unit}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}