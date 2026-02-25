import { motion, useMotionValue, useTransform } from "framer-motion";
import NavLink from "@/features/navigation/components/NavLink";
import styles from "../styles/RecordCard.module.css";
import type { RecordMeta } from "./recordMeta";
import type { SwapiType } from "@/lib/swapi/swapi-types";
import { useAtmosphere } from "@/features/layout/components/AtmosphereContext";

type Props = {
  category: SwapiType;
  meta: RecordMeta;
  index?: number;
};

export default function RecordCard({
  category,
  meta,
  index = 0,
}: Props) {

  const { setHighlight } = useAtmosphere();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-120, 120], [7, -7]);
  const rotateY = useTransform(x, [-120, 120], [-7, 7]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {

    const rect = e.currentTarget.getBoundingClientRect();

    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    x.set(offsetX);
    y.set(offsetY);
  }

  function reset() {
    x.stop();
    y.stop();
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      layoutId={`card-${category}-${meta.id}`}
      className={styles.wrapper}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHighlight(category)}
      onMouseLeave={() => {
        setHighlight(undefined);
        reset();
      }}
      initial={{
        opacity: 0,
        y: 24,
        scale: 0.96,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.06,
      }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
        willChange: "transform",
      }}
      data-category={category}
    >
      <NavLink
        href={`/${category}/${meta.id}`}
        label={meta.title}
        className={styles.card}
      >

        <div className={styles.surface}>

          {/* Tactical header */}
          <div className={styles.dataHeader} />

          {/* Visual layers */}
          <div className={styles.glow} />
          <div className={styles.sweep} />

          {/* Card content */}
          <div className={styles.content}>

            <div className={styles.cardHeader}>
              <span className={styles.recordHeader}>Record</span>
              <span>ID: {meta.id}</span>
            </div>

            <div className={styles.title}>
              {meta.title}
            </div>

            {meta.subtitle && (
              <div className={styles.subtitle}>
                {meta.subtitle}
              </div>
            )}

            <div className={styles.openDetail}>
              Open detail →
            </div>

          </div>

        </div>

      </NavLink>
    </motion.div>
  );
}