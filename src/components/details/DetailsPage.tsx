"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import styles from "./DetailsPage.module.css";
import { useRegisterNavigation } from "../navigation/useRegisterNavigation";
import type { SwapiType } from "@/components/types/swapi-types";
import HoloHeader from "@/components/HoloHeader/HoloHeader";
import OpeningCrawl from "@/components/details/OpeningCrawl";
import RecordAttributesGrid from "@/components/records/RecordAttributesGrid";
import DetailsTabs from "./DetailsTabs";
import RelatedRail from "./RelatedRail";
import RelatedPanel from "./RelatedPanel";
import RecentPanel from "../navigation/RecentPanel";
import TargetLock from "./TargetLock";

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

  // ✅ Register ONLY once meaningful title exists
  useRegisterNavigation({
    label: meta.title,
    href: `/${category}/${meta.id}`,
  });


  return (
    <PageWrapper category={category}>
      <div className={styles.page}>
        <HoloHeader
          category={category}
          title={meta.title}
          subtitle={meta.subtitle}
          showBack
          breadcrumbs={[
            { label: "Archive", href: "/" },
            { label: category, href: `/${category}` },
            { label: meta.title, href: `/${category}/${meta.id}` },
          ]}      
         />
         <TargetLock />       

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
      <RecentPanel />
    </PageWrapper>
  );
}