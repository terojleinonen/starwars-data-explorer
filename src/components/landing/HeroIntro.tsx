"use client";

import { motion } from "framer-motion";
import styles from "./HeroIntro.module.css";

type Props = {
  title: string;
  subtitle: string;
};

export default function HeroIntro({ title, subtitle }: Props) {
  const letters = title.split("");

  return (
    <div className={styles.introWrapper}>
      <motion.h1
        className={styles.title}
        initial="hidden"
        animate="visible"
      >
        {letters.map((char, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  delay: i * 0.04,
                  duration: 0.4,
                },
              },
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.h1>

      <motion.p
        className={styles.subtitle}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        {subtitle}
      </motion.p>

      <motion.div
        className={styles.systemTag}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        POWERED BY SWAPI
      </motion.div>
    </div>
  );
}