"use client";

import { motion } from "framer-motion";
import styles from "./AnimatedCardGrid.module.css";

type Props = {
  children: React.ReactNode;
};

export default function AnimatedCardGrid({ children }: Props) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: 2.2,
          },
        },
      }}
      className={styles.cardGrid}
    >
      {children}
    </motion.div>
  );
}