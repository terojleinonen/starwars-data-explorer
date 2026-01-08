"use client";

import type { ReactNode } from "react";
import styles from "./PageWrapper.module.css";

type Props = {
  children: ReactNode;
  /** category name, used for atmosphere */
  atmosphere?: string;
};

export default function PageWrapper({
  children,
  atmosphere,
}: Props) {
  return (
    <div
      className={styles.wrapper}
      data-atmosphere={atmosphere}
    >
      {/* ===============================
         Background layers
      =============================== */}

      <div className={styles.background} />
      <div className={styles.atmosphere} />
      <div className={styles.grid} />

      {/* ===============================
         Content surface
      =============================== */}

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}