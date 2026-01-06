"use client";

import type { ReactNode } from "react";
import styles from "./DetailsPage.module.css";

import type { SwapiType } from "@/components/types/swapi-types";
import PageWrapper from "@/components/layout/PageWrapper";

import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import HoloHeader from "@/components/HoloHeader/HoloHeader";
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
   Component
----------------------------------------------- */

export default function DetailsPage({
  category,
  data,
  stats,
}: Props) {
  const meta: RecordMeta = getRecordMetaFromItem(
    data,
    category,
    "—"
  );

  return (
    <PageWrapper atmosphere={category}>
      <section className={styles.page}>
        <div className={styles.flow}>

          {/* ================= HERO PLANE ================= */}
          <div
            className={`${styles.plane} ${styles.planeHero}`}
          >
            <Breadcrumbs />

            <HoloHeader
              category={category}
              title={meta.title}
              subtitle={meta.subtitle}
            />

            {typeof data.opening_crawl ===
              "string" && (
              <OpeningCrawl
                text={data.opening_crawl}
              />
            )}
          </div>

          <div className={styles.divider} />

          {/* ================= ATTRIBUTES ================= */}
          <div
            className={`${styles.plane} ${styles.planeNeutral}`}
          >
            {stats && stats.length > 0 && (
              <div className={styles.stats}>
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className={styles.stat}
                  >
                    <span
                      className={styles.statLabel}
                    >
                      {s.label}
                    </span>
                    <span
                      className={styles.statValue}
                    >
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <AttributesPanel
              data={data}
              category={category}
            />
          </div>

          <div className={styles.divider} />

          {/* ================= RELATED ================= */}
          <div
            className={`${styles.plane} ${styles.planeRecede}`}
          >
            <RelatedRail data={data} />
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}