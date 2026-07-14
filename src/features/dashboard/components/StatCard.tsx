"use client";

import { Metric, Surface } from "@/ui";
import styles from "../styles/StatCard.module.css";

type Props = {
  label: string;
  value: string | number;
  hint?: string;
  featured?: boolean;
};

export default function StatCard({ label, value, hint, featured = false }: Props) {
  return (
    <Surface material="plate" elevation={1} padding="md" className={styles.card}>
      <Metric label={label} value={value} hint={hint} featured={featured} />
    </Surface>
  );
}
