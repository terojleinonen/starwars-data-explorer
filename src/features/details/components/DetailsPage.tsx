"use client";

import { motion } from "framer-motion";
import type { SwapiType } from "@/lib/swapi/swapiTypes";
import { PageWrapper } from "@/features/layout";
import { useRegisterNavigation, RecentPanel } from "@/features/navigation";

import {
  OpeningCrawl,
  DetailsTabs,
  RelatedRail,
  RelatedPanel,
} from "@/features/details";

import { RecordAttributesGrid } from "@/features/records";
import { HoloHeader } from "@/ui/HoloHeader";

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

  /* Register navigation history */

  useRegisterNavigation({
    label: meta.title,
    href: `/${category}/${meta.id}`,
  });

  return (
    <PageWrapper category={category}>
      <div className={styles.page}>
        {/* Header transition for card morph animation */}
        <motion.div
          layoutId={`card-${category}-${meta.id}`}
          className={styles.headerTransition}
        >
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
        </motion.div>
        {/* Film opening crawl (films only) */}
        {typeof data.opening_crawl === "string" && (
          <OpeningCrawl text={data.opening_crawl} />
        )}

        {/* Main content */}

        <div className={styles.content}>
          <DetailsTabs
            relatedReady={hasRelated}
            overview={
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
              >
                <RecordAttributesGrid
                  category={category}
                  data={data}
                />
              </motion.div>
            }
            related={
              <RelatedPanel>
                <RelatedRail data={data} />
              </RelatedPanel>
            }
          />
        </div>
      </div>
      {/* Navigation history panel */}
      <RecentPanel />
    </PageWrapper>
  );
}