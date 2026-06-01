"use client";

import StatCard from "./StatCard";

import styles from "../styles/StatsBar.module.css";

export type DashboardStat = {
  label: string;
  value: string | number;
  hint?: string;
};

type Props = {
  stats?: DashboardStat[];
};

export default function StatsBar({
  stats = [],
}: Props) {
  if (!stats.length) {
    return null;
  }

  return (
    <div className={styles.grid}>
      {stats.map((stat, index) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          hint={stat.hint}
          featured={index === 0}
        />
      ))}
    </div>
  );
}