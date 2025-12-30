"use client";

import { useEffect, useState } from "react";
import styles from "./DetailsPage.module.css";
import { cachedFetch } from "@/lib/swapiCache";

type Props = {
  category: string;
  id: string;
};

type SwapiRecord = {
  name?: string;
  title?: string;
  url: string;
  [key: string]: unknown;
};

function isUrl(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("http");
}

function isPrimitive(
  value: unknown
): value is string | number {
  return (
    typeof value === "string" ||
    typeof value === "number"
  );
}

export default function DetailsPage({ category, id }: Props) {
  const [data, setData] = useState<SwapiRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const record = await cachedFetch<SwapiRecord>(
          `https://swapi.py4e.com/api/${category}/${id}/`
        );
        if (active) {
          setData(record);
        }
      } catch (err) {
        if (active) {
          setError("Failed to load galactic record.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [category, id]);

  if (loading) {
    return (
      <p className={styles.status}>
        Loading galactic record…
      </p>
    );
  }

  if (error || !data) {
    return (
      <p className={styles.error}>
        {error ?? "Record not found."}
      </p>
    );
  }

  const title =
    data.name ?? data.title ?? "Galactic Record";

  return (
    <section className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <span className={styles.eyebrow}>
          {category.toUpperCase()}
        </span>
        <h1 className={styles.title}>{title}</h1>
      </header>

      {/* DETAILS GRID */}
      <dl className={styles.grid}>
        {Object.entries(data).map(([key, value]) => {
          if (
            key === "url" ||
            key === "created" ||
            key === "edited"
          ) {
            return null;
          }

          if (Array.isArray(value)) {
            if (value.length === 0) return null;

            return (
              <div
                key={key}
                className={styles.row}
              >
                <dt>{formatLabel(key)}</dt>
                <dd>
                  {value
                    .filter(isPrimitive)
                    .join(", ")}
                </dd>
              </div>
            );
          }

          if (isPrimitive(value)) {
            return (
              <div
                key={key}
                className={styles.row}
              >
                <dt>{formatLabel(key)}</dt>
                <dd>{value}</dd>
              </div>
            );
          }

          if (isUrl(value)) {
            return null; // handled via RelatedRail later
          }

          return null;
        })}
      </dl>
    </section>
  );
}

/* ---------- helpers ---------- */

function formatLabel(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
