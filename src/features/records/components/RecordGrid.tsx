"use client";

import styles from "../styles/RecordGrid.module.css";
import { RecordCard } from "@/features/records";
import { normalizeRecord } from "@/lib/swapi/indexer";
import type { SwapiType, SwapiItem} from "@/lib/swapi/types";

type Props = {
  category: SwapiType;
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
      <div className={styles.grid}>

        {normalizedRecords.map((record, index) => (
          <div
            key={String(record.id)}
            className={styles.item}
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <RecordCard
              category={category}
              meta={record}
              index={index}
            />
          </div>
        ))}

      </div>
    </div>
  );
}