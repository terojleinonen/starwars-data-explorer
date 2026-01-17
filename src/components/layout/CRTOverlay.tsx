"use client";

import styles from "./CRTOverlay.module.css";

type Props = {
  enabled?: boolean;
};

export default function CRTOverlay({ enabled = true }: Props) {
  if (!enabled) return null;

  return (
    <div
      className={styles.crt}
      aria-hidden="true"
    />
  );
}