"use client";

import type { ReactNode } from "react";
import styles from "./DetailsPage.module.css";

import type { SwapiType } from "@/components/types/swapi-types";
import HoloHeader from "@/components/HoloHeader/HoloHeader";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import OpeningCrawl from "@/components/details/OpeningCrawl";
import AttributesPanel from "./AttributesPanel";
import RelatedRail from "./RelatedRail";


import {
  getRecordMetaFromItem,
  type RecordMeta,
} from "@/lib/recordMeta";

/* -----------------------------------------------
   Types
----------------------------------------------- */

type Stat = {
  label: string;
  value: string | number;
};

type Props = {
  category: SwapiType;
  data: Record<string, unknown>;
  stats?: Stat[];
  children?: ReactNode;
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

function formatLabel(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) =>
      c.toUpperCase()
    );
}

/* -----------------------------------------------
   Exclusions
----------------------------------------------- */

const EXCLUDED_KEYS = new Set([
  "url",
  "created",
  "edited",
  "name",
  "title",
  "opening_crawl",
]);

/* -----------------------------------------------
   Component
----------------------------------------------- */

export default function DetailsPage({
  category,
  data,
  stats,
  children,
}: Props) {
  const meta: RecordMeta =
    getRecordMetaFromItem(
      data,
      category,
      "—"
    );

  return (
    <section className={styles.page}>
      {/* ================= BREADCRUMBS ================= */}
      <Breadcrumbs />

      {/* ================= HOLO HEADER ================= */}
      <div className={styles.headerFade}>
        <HoloHeader
          category={category}
          title={meta.title}
          subtitle={meta.subtitle}
        />
      </div>
      {/* ================= OPENING CRAWL ================= */}
      {typeof data.opening_crawl === "string" && (
        <OpeningCrawl text={data.opening_crawl} />
      )}

      {/* ================= STATS ================= */}
      {stats && stats.length > 0 && (
        <div className={styles.stats}>
          {stats.map((s) => (
            <div
              key={s.label}
              className={styles.stat}
            >
              <span className={styles.statLabel}>
                {s.label}
              </span>
              <span className={styles.statValue}>
                {s.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ================= DETAILS GRID ================= */}
      <AttributesPanel data={data} category={category}/>

      {/* ================= RELATIONS / EXTENSIONS ================= */}
      <RelatedRail data={data} />
    </section>
  );
}