"use client";

import { useRouter } from "next/navigation";
import styles from "./SystemBack.module.css";

type Props = {
  fallbackHref?: string;
};

export default function SystemBack({ fallbackHref }: Props) {
  const router = useRouter();

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
    } else if (fallbackHref) {
      router.push(fallbackHref);
    }
  }

  return (
    <button
      onClick={handleBack}
      className={styles.back}
      aria-label="Go back"
    >
      <span className={styles.arrow}>←</span>
      Back
    </button>
  );
}