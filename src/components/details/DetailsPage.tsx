"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import styles from "./DetailsPage.module.css";

import type { SwapiType } from "@/components/types/swapi-types";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import HoloHeader from "@/components/HoloHeader/HoloHeader";
import OpeningCrawl from "@/components/details/OpeningCrawl";
import RecordAttributesGrid from "@/components/records/RecordAttributesGrid";
import DetailsTabs from "./DetailsTabs";
import RelatedRail from "./RelatedRail";
import RelatedPanel from "./RelatedPanel";

import {
  getRecordMetaFromItem,
  type RecordMeta,
} from "@/lib/recordMeta";
import SystemBack from "../navigation/SystemBack";

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
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);


  return (
    <PageWrapper category={category}>
      <div className={styles.page}>
        <div className={styles.breadcrumbRow}>
          <SystemBack fallbackHref={`/${category}`} />
            <Breadcrumbs items={[
              { label: "Archive", href: "/" },
              { label: categoryLabel, href: `/${category}` },
              { label: meta.title },
            ]} />
        </div>
        <HoloHeader
          category={category}
          title={meta.title}          
        />

        {typeof data.opening_crawl === "string" && (
          <OpeningCrawl text={data.opening_crawl} />
        )}

        <DetailsTabs
          relatedReady={hasRelated}
          overview={
            <>
              <RecordAttributesGrid category={category} data={data} />
            </>
          }
          related={
            <RelatedPanel>
              <RelatedRail data={data} />
            </RelatedPanel>
          }
        />
      </div>
    </PageWrapper>
  );
}