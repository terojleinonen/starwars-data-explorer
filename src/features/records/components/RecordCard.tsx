"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import Link from "next/link";
import type { RecordMeta } from "./recordMeta";
import styles from "../styles/RecordCard.module.css";

type Props = {
  category: string;
  meta: RecordMeta;
  index?: number;
};

export default function RecordCard({
  category,
  meta,
  index = 0,
}: Props) {


  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [6, -6]);
  const rotateY = useTransform(x, [-100, 100], [-6, 6]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {

    const rect = e.currentTarget.getBoundingClientRect();

    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    x.set(offsetX);
    y.set(offsetY);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (

    <motion.div
      layoutId={`card-${category}-${meta.id}`}
      className={styles.wrapper}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        reset();
      }}
      initial={{
        opacity: 0,
        y: 18,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.05,
      }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
      }}
      data-category={category}
    >

      <Link
        href={`/${category}/${meta.id}`}
        className={styles.card}
      >

        <div className={styles.surface}>

          {/* visual layers */}

          <div className={styles.glow} />
          <div className={styles.sweep} />

          {/* card content */}

          <div className={styles.content}>

            <div className={styles.recordId}>
              {meta.id}
            </div>

            <div className={styles.textBlock}>

              <div className={styles.title}>
                {meta.title}
              </div>

                {meta.subtitle && (
                  <div className={styles.subtitle}>
                    {meta.subtitle}
                  </div>
                )}

            </div>

            <div className={styles.openDetail}>
              Open →
            </div>               

          </div>
          </div>
      </Link>
    </motion.div>
  );
}