"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import styles from "./DetailsPage.module.css";

import type { SwapiType } from "@/components/types/swapi-types";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import HoloHeader from "@/components/HoloHeader/HoloHeader";
import OpeningCrawl from "@/components/details/OpeningCrawl";

import DetailsTabs from "./DetailsTabs";
import StatsGrid, { type StatValue } from "../stats/StatsGrid";
import AttributesPanel from "./AttributesPanel";
import RelatedRail from "./RelatedRail";
import RelatedPanel from "./RelatedPanel";

import {
  getRecordMetaFromItem,
  type RecordMeta,
} from "@/lib/recordMeta";

/* -----------------------------------------------
   Helpers
----------------------------------------------- */

function isUrl(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("http");
}

function isUrlArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every(isUrl);
}

/* -----------------------------------------------
   Component
----------------------------------------------- */

type Props = {
  category: SwapiType;
  data: Record<string, unknown>;
};

export default function DetailsPage({ category, data }: Props) {
  const meta: RecordMeta = getRecordMetaFromItem(
    data,
    category,
    "—"
  );

  const hasRelated = Object.values(data).some(isUrlArray);

  return (
    <PageWrapper atmosphere={category}>
      <section className={styles.page}>
        {/* ================= BREADCRUMBS ================= */}
        <Breadcrumbs />

        {/* ================= HOLO HEADER ================= */}
        <div className={styles.headerFade}>
          <HoloHeader
            category={category}
            title={meta.title}
            subtitle={meta.subtitle}
            size="lg"
          />
        </div>

        {/* ================= OPENING CRAWL ================= */}
        {typeof data.opening_crawl === "string" && (
          <OpeningCrawl text={data.opening_crawl} />
        )}

        {/* ================= TABS ================= */}
        <DetailsTabs
          relatedReady={hasRelated}
          overview={
            <>
              {/* ===== STATS ===== */}
              <StatsGrid
                stats={[
                  { label: "Rotation Period", value: data.rotation_period as StatValue, unit: "h" },
                  { label: "Orbital Period", value: data.orbital_period as StatValue, unit: "d" },
                  { label: "Diameter", value: data.diameter as StatValue, unit: "km" },
                  { label: "Climate", value: data.climate as StatValue },
                  { label: "Gravity", value: data.gravity as StatValue },
                  { label: "Terrain", value: data.terrain as StatValue },
                  { label: "Surface Water", value: data.surface_water as StatValue, unit: "%" },
                  { label: "Population", value: data.population as StatValue },
                ]}
              />

              {/* ===== ATTRIBUTES ===== */}
              <AttributesPanel
                data={data}
                category={category}
              />
            </>
          }
          related={
            <RelatedPanel>
              <RelatedRail data={data} />
            </RelatedPanel>
          }
        />
      </section>
    </PageWrapper>
  );
}