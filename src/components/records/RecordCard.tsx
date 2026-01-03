import { motion } from "framer-motion";
import NavLink from "@/components/navigation/NavLink";
import styles from "./RecordCard.module.css";
import type { RecordMeta } from "./recordMeta";
import type { SwapiType } from "@/components/types/swapi-types";

type Props = {
  category: SwapiType;
  meta: RecordMeta;
};

export default function RecordCard({
  category,
  meta,
}: Props) {
  return (
    <motion.div
      layoutId={`card-${category}-${meta.id}`}
      className={styles.cardWrapper}
    >
      <NavLink
        href={`/${category}/${meta.id}`}
        label={meta.title}
        className={styles.card}
      >
        <div className={styles.cardHeader}>
          <span className={styles.recordHeader}>
            Record
          </span>
          <span>ID: {meta.id}</span>
        </div>

        <div className={styles.title}>
          {meta.title}
        </div>

        {meta.subtitle && (
          <div className={styles.secondary}>
            {meta.subtitle}
          </div>
        )}

        <div className={styles.openDetail}>
          Open detail →
        </div>
      </NavLink>
    </motion.div>
  );
}