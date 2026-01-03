import styles from "./RecordGrid.module.css";
import { SwapiItem } from "@/components/useSwapi";
import { SwapiType } from "@/components/types/swapi-types";
import RecordCard from "./RecordCard";
import { getRecordMeta } from "./recordMeta";

type Props = {
  items: SwapiItem[];
  category: SwapiType;
};

export default function RecordGrid({
  items,
  category,
}: Props) {
  return (
    <div className={styles.grid}>
      {items.map((item, index) => {
        const meta = getRecordMeta(
          item,
          String(index + 1)
        );

        return (
          <RecordCard
            key={`${category}-${meta.id}`}
            category={category}
            meta={meta}
          />
        );
      })}
    </div>
  );
}