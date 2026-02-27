"use client";

import type { SwapiType } from "@/lib/swapi/types";
import { PageWrapper } from "@/features/layout";
import { useRegisterNavigation, RecentPanel} from "@/features/navigation";
import { OpeningCrawl } from "@/features/details";
import { RecordAttributesGrid }from "@/features/records";
import { HoloHeader } from "@/ui/HoloHeader";
import { DetailsTabs, RelatedRail, RelatedPanel, TargetLock} from "@/features/details";
import styles from "../styles/DetailsPage.module.css";

import {
  getRecordMetaFromItem,
  type RecordMeta,
} from "@/features/records/components/recordMeta";

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