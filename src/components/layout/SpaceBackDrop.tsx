"use client";

import { ReactNode } from "react";
import styles from "./SpaceBackdrop.module.css";

type Props = {
  children: ReactNode;
};

export default function SpaceBackdrop({ children }: Props) {
  return (
    <div className={styles.backdrop}>
      <div className={styles.base} />
      <div className={styles.nebula} />
      <div className={styles.bloom} />
      <div className={styles.stars} />
      {children}
    </div>
  );
}