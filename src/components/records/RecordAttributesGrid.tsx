"use client";

import { motion } from "framer-motion";
import styles from "./RecordAttributesGrid.module.css";
import type { SwapiType } from "@/components/types/swapi-types";
import { RECORD_PRIMARY_STATS } from "@/lib/recordAttributesConfig";

export type StatValue = string | number | null | undefined;

type Props = {
  category: SwapiType;
  data: Record<string, unknown>;
};

function isPrimitive(v: unknown): v is string | number {
  return typeof v === "string" || typeof v === "number";
}

function isUrl(v: unknown): v is string {
  return typeof v === "string" && v.startsWith("http");
}

function formatLabel(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

export default function RecordAttributesGrid({ category, data }: Props) {
  const primaryDefs = RECORD_PRIMARY_STATS[category] ?? [];
  const primaryKeys = new Set(primaryDefs.map((d) => d.key));

  // Primary cards (curated)
  const primary = primaryDefs
    .map((def) => ({
      label: def.label,
      value: (data[def.key] as StatValue) ?? "—",
      unit: def.unit,
      key: def.key,
    }))
    // keep even if missing, but you can filter empties if you want
    .filter(Boolean);

  // Secondary cards (auto)
  const secondary = Object.entries(data)
    .filter(([key, value]) => {
      if (primaryKeys.has(key)) return false;

      // exclude noisy/handled elsewhere
      if (
        key === "url" ||
        key === "created" ||
        key === "edited" ||
        key === "opening_crawl" ||
        key === "name" ||
        key === "title"
      )
        return false;

      // exclude URLs + arrays/objects (RelatedRail handles relations)
      if (isUrl(value)) return false;
      if (Array.isArray(value)) return false;
      if (value && typeof value === "object") return false;

      return isPrimitive(value);
    })
    .map(([key, value]) => ({
      key,
      label: formatLabel(key),
      value: value as StatValue,
    }));

  if (primary.length === 0 && secondary.length === 0) return null;

  return (
    <section className={styles.section}>
      <h3 className={styles.heading}>Record Details</h3>

      <motion.div
        className={styles.grid}
        variants={container}
        initial="hidden"
        animate="show"
      >
        {primary.map((s) => (
          <motion.div
            key={`primary-${s.key}`}
            className={`${styles.card} ${styles.primary}`}
            variants={item}
          >
            <span className={styles.label}>{s.label}</span>
            <span className={styles.value}>
              {s.value ?? "—"}
              {s.unit && <span className={styles.unit}>{s.unit}</span>}
            </span>
          </motion.div>
        ))}

        {secondary.map((s) => (
          <motion.div
            key={`secondary-${s.key}`}
            className={`${styles.card} ${styles.secondary}`}
            variants={item}
          >
            <span className={styles.label}>{s.label}</span>
            <span className={styles.valueSmall}>{s.value ?? "—"}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}