"use client";

import { useEffect, useState } from "react";
import styles from "./RelatedRail.module.css";

import NavLink from "@/components/navigation/NavLink";
import { cachedFetch } from "@/lib/swapiCache";
import {
  getRecordMetaFromItem,
  type RecordMeta,
} from "@/lib/recordMeta";
import type { SwapiType } from "@/components/types/swapi-types";

/* -----------------------------------------------
   Types
----------------------------------------------- */

type RelatedGroup = {
  label: string;
  items: RecordMeta[];
};

type Props = {
  data: Record<string, unknown>;
};

/* -----------------------------------------------
   Helpers
----------------------------------------------- */

function isUrl(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.startsWith("http")
  );
}

function isUrlArray(
  value: unknown
): value is string[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(isUrl)
  );
}

function getCategoryFromUrl(
  url: string
): SwapiType | null {
  const parts = url.split("/").filter(Boolean);
  return (parts[parts.length - 2] ??
    null) as SwapiType | null;
}

function formatLabel(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) =>
      c.toUpperCase()
    );
}

/* -----------------------------------------------
   RelatedRail
----------------------------------------------- */

export default function RelatedRail({
  data,
}: Props) {
  const [groups, setGroups] = useState<
    RelatedGroup[]
  >([]);

  const selfUrl =
  typeof data.url === "string"
    ? data.url
    : null;


  useEffect(() => {
    let active = true;

    async function load() {
      const grouped: Record<
        string,
        RecordMeta[]
      > = {};

      for (const [key, value] of Object.entries(
        data
      )) {
        const urls: string[] = [];

        if (selfUrl && value === selfUrl) {
          continue;
        }

        // Array relations (films, characters, etc.)
        if (isUrlArray(value)) {
          urls.push(...value);
        }

        // Single relation (homeworld)
        if (isUrl(value)) {
          urls.push(value);
        }

        if (urls.length === 0) continue;

        for (const url of urls) {
          try {
            const record =
              await cachedFetch<any>(url);

            const category =
              getCategoryFromUrl(url);
            if (!category) continue;

            const meta =
              getRecordMetaFromItem(
                record,
                category,
                "—"
              );

            // Guard against invalid records
            if (
              !meta.title ||
              meta.title === "Unknown record"
            ) {
              continue;
            }

            if (!grouped[key]) {
              grouped[key] = [];
            }

            grouped[key].push(meta);
          } catch {
            // Ignore broken relations
          }
        }
      }

      if (!active) return;

      const result: RelatedGroup[] =
        Object.entries(grouped).map(
          ([key, items]) => ({
            label: formatLabel(key),
            items,
          })
        );

      setGroups(result);
    }

    load();
    return () => {
      active = false;
    };
  }, [data]);

  if (groups.length === 0) return null;

  return (
    <section className={styles.rail}>
      <header className={styles.railHeader}>
        <h2 className={styles.railTitle}>
          Connected Systems
        </h2>
        <span className={styles.railMeta}>
          {groups.length} groups
        </span>
      </header>

      <div className={styles.groups}>
        {groups.map((group) => (
          <div
            key={group.label}
            className={styles.group}
          >
            <h3 className={styles.heading}>
              {group.label}
            </h3>

            <ul className={styles.list}>
              {group.items.map((meta) => (
                <li key={meta.id}>
                  <NavLink
                    href={`/${meta.category}/${meta.id}`}
                    label={meta.title}
                    className={styles.link}
                  >
                    <span
                      className={styles.title}
                    >
                      {meta.title}
                    </span>

                    {meta.subtitle && (
                      <span
                        className={
                          styles.subtitle
                        }
                      >
                        {meta.subtitle}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}