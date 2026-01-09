"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { SwapiItem, SwapiType } from "@/components/types/swapi-types";
import RecordCard from "./RecordCard";
import styles from "./RecordGrid.module.css";
import { getRecordMeta } from "./recordMeta";

type Props = {
  items: SwapiItem[];
  category: SwapiType;
};

export default function RecordGrid({ items, category }: Props) {
  return (
    <motion.div
      className={styles.grid}
      layout
      transition={{
        layout: {
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
    >
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => {
          const meta = getRecordMeta(item, String(index));
          return (
            <RecordCard
              key={
                typeof item.url === "string"
                  ? item.url
                  : `${category}-${index}`
              }
              meta={meta}
              category={category}
            />
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}