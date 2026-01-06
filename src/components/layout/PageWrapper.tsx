"use client";

import type { ReactNode } from "react";
import styles from "./PageWrapper.module.css";

type Props = {
  children: ReactNode;
  /** Optional category for atmospheric color */
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
         Visual environment layers
      =============================== */}

      <div className={styles.space} />
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
