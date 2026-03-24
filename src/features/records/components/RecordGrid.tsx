"use client";

import styles from "../styles/RecordGrid.module.css";
import { RecordCard } from "@/features/records";
import { normalizeRecord } from "@/lib/swapi/swapiIndexer";
import type { SwapiItem} from "@/lib/swapi/swapiTypes";

type Props = {
  category: string;
  records: SwapiItem[];
};

export default function RecordGrid({
  category,
  records,
}: Props) {

  const normalizedRecords = records.map(normalizeRecord);

  if (!normalizedRecords || normalizedRecords.length === 0) {
    return (
      <div className={styles.empty}>
        No records found.
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.scanline} />
        <div className={styles.grid}>
          {normalizedRecords.map((record, index) => (
            <RecordCard
              key={String(record.id)}
              category={category}
              meta={record}
            />
          ))}
        </div>
      </div>
    );
}