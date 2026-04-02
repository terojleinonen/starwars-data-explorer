"use client";

import { HoloCard } from "@/features/holo";
import { SwapiType } from "@/lib/swapi/swapiTypes";
import styles from "../styles/RecordGrid.module.css";

type Props = {
  records: any[];
  category: SwapiType;
};

export default function RecordGrid({ records, category }: Props) {
  return (
    <div className={styles.grid}>
      {records.map((item) => {
        const id = item.url.match(/\/(\d+)\/?$/)?.[1];

        const title = item.name || item.title || "Unknown";

        const subtitle =
          item.model ||
          item.climate ||
          item.gender ||
          item.director ||
          "";

        return (
          <HoloCard
            category={category}
            key={id}
            title={title}
            subtitle={subtitle}
            href={`/${category}/${id}`}
          />
        );
      })}
    </div>
  );
}