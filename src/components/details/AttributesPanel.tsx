"use client";

import styles from "./AttributesPanel.module.css";

/* -----------------------------------------------
   Types
----------------------------------------------- */

type Props = {
  data: Record<string, unknown>;
  category?: string;
};

/* -----------------------------------------------
   Helpers
----------------------------------------------- */

function isPrimitive(
  value: unknown
): value is string | number {
  return (
    typeof value === "string" ||
    typeof value === "number"
  );
}

function isUrlString(value: unknown): boolean {
  return (
    typeof value === "string" &&
    value.startsWith("http")
  );
}

function formatLabel(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) =>
      c.toUpperCase()
    );
}

/* -----------------------------------------------
   Constants
----------------------------------------------- */

const HEADING_BY_CATEGORY: Record<string, string> = {
  people: "Physical Profile",
  species: "Biological Profile",
  starships: "Technical Specifications",
  vehicles: "Technical Specifications",
  planets: "Planetary Characteristics",
};

/* -----------------------------------------------
   Exclusions
----------------------------------------------- */

const EXCLUDED_KEYS = new Set([
  // identity
  "name",
  "title",

  // meta
  "url",
  "created",
  "edited",

  // narrative
  "opening_crawl",

  // relations (handled elsewhere)
  "homeworld",
  "films",
  "people",
  "species",
  "vehicles",
  "starships",
]);

/* -----------------------------------------------
   Component
----------------------------------------------- */

export default function AttributesPanel({
  data,
  category,
}: Props) {
  const rows = Object.entries(data).filter(
  ([key, value]) => {
    if (EXCLUDED_KEYS.has(key)) {
      return false;
    }

    // Exclude any URL strings
    if (isUrlString(value)) {
      return false;
    }

    // Exclude arrays containing URLs
    if (Array.isArray(value)) {
      return (
        value.length > 0 &&
        value.every(
          (v) =>
            typeof v === "string" ||
            typeof v === "number"
        ) &&
        !value.some(isUrlString)
      );
    }

    return isPrimitive(value);
  }
);

const heading =
  (category && HEADING_BY_CATEGORY[category]) ??
  "Attributes";


  return (
    <section className={styles.panel}>
      <h2 className={styles.heading}>
        {heading}
      </h2>


      <dl className={styles.grid}>
        {rows.map(([key, value]) => (
          <div
            key={key}
            className={styles.row}
          >
            <dt>{formatLabel(key)}</dt>
            <dd>
              {Array.isArray(value)
                ? value.join(", ")
                : String(value)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}