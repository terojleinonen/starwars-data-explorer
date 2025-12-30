"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./RelatedRail.module.css";
import { cachedFetch, prefetch } from "@/lib/swapiCache";

type RelatedItem = {
  url: string;
  id: string;
  label: string;
};

type Props = {
  label: string;
  category: string;
  items?: unknown;
};

function getIdFromUrl(url: string) {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? match[1] : null;
}

export default function RelatedRail({
  label,
  category,
  items,
}: Props) {
  const [resolved, setResolved] = useState<RelatedItem[]>([]);

  useEffect(() => {
    let active = true;

    if (!Array.isArray(items) || items.length === 0) {
      setResolved([]);
      return;
    }

    async function load() {
      const results: RelatedItem[] = [];

      if (!Array.isArray(items)) return;

      for (const url of items) {
        if (typeof url !== "string") continue;

        const id = getIdFromUrl(url);
        if (!id) continue;

        try {
          const record = await cachedFetch<any>(url);

          const label =
            record?.name ??
            record?.title ??
            "Unknown";

          results.push({
            url,
            id,
            label,
          });
        } catch {
          /* ignore broken relations */
        }
      }

      if (active) {
        setResolved(results);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [items]);

  if (resolved.length === 0) return null;

  return (
    <section className={styles.rail}>
      <h2 className={styles.heading}>{label}</h2>

      <ul className={styles.list}>
        {resolved.map((item) => (
          <li key={item.url}>
            <Link
              href={{
               pathname: `/${category}/${item.id}`,
              query: {
                fromLabel: label,
                fromHref: `/${category}`,
              },
            }}
              className={styles.link}
            >
              <span className={styles.label}>
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}