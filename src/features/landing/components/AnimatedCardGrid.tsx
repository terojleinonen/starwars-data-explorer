"use client";

import React from "react";
import styles from "../styles/AnimatedCardGrid.module.css";

type Props = {
  children: React.ReactNode;
};

export default function AnimatedCardGrid({ children }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.scanline} />

      <div className={styles.grid}>
        {React.Children.map(children, (child, index) => (
          <div
            className={styles.item}
            style={{ animationDelay: `${index * 90}ms` }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}