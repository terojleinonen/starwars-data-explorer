"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./RelatedRail.module.css";
import { cachedFetch } from "@/lib/swapiCache";
import type { SwapiType } from "@/components/types/swapi-types";

/* -----------------------------------------------
   Types
----------------------------------------------- */

type RelatedItem = {
  id: string;
  label: string;
  category: SwapiType;
};

type GroupedItems = Partial<Record<SwapiType, RelatedItem[]>>;

type Props = {
  data: Record<string, unknown>;
};

/* -----------------------------------------------
   Helpers
----------------------------------------------- */

function isUrlArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (v) => typeof v === "string" && v.startsWith("http")
    )
  );
}

function getCategoryFromUrl(url: string): SwapiType | null {
  const parts = url.split("/").filter(Boolean);
  return (parts[parts.length - 2] as SwapiType) ?? null;
}

function getIdFromUrl(url: string): string | null {
  const match = url.match(/\/(\d+)\/?$/);
  return match?.[1] ?? null;
}

/* -----------------------------------------------
   Component
----------------------------------------------- */

export default function RelatedRail({ data }: Props) {
  const [groups, setGroups] = useState<GroupedItems>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let active = true;

    async function load() {
      const grouped: GroupedItems = {};

      for (const value of Object.values(data)) {
        if (!isUrlArray(value)) continue;

        for (const url of value) {
          try {
            const record = await cachedFetch<any>(url);
            const category = getCategoryFromUrl(url);
            const id = getIdFromUrl(url);

            if (!category || !id) continue;

            const label =
              record.name ??
              record.title ??
              "Unknown";

            grouped[category] ??= [];
            grouped[category].push({
              id,
              label,
              category,
            });
          } catch {
            /* ignore broken relations */
          }
        }
      }

      if (!active) return;

      setGroups(grouped);

      // auto-expand small groups
      const autoExpanded: Record<string, boolean> = {};
      for (const [key, items] of Object.entries(grouped)) {
        autoExpanded[key] = items.length <= 6;
      }
      setExpanded(autoExpanded);
    }

    load();
    return () => {
      active = false;
    };
  }, [data]);

  const categories = Object.entries(groups);
  if (categories.length === 0) return null;

  return (
    <div className={styles.container}>
      {categories.map(([category, items]) => {
        if (!items) return null;

        const isOpen = expanded[category];

        return (
          <section
            key={category}
            className={styles.group}
          >
            <button
              className={styles.groupHeader}
              onClick={() =>
                setExpanded((s) => ({
                  ...s,
                  [category]: !isOpen,
                }))
              }
              aria-expanded={!!isOpen}
            >
              <span className={styles.groupTitle}>
                {category}
              </span>

              <span className={styles.count}>
                {items.length}
              </span>

              <span
                className={`${styles.chevron} ${
                  isOpen ? styles.open : ""
                }`}
              />
            </button>

            {isOpen && (
              <ul className={styles.list}>
                {items.map((item) => (
                  <li key={`${category}-${item.id}`}>
                    <Link
                      href={`/${item.category}/${item.id}`}
                      className={styles.link}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}