"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./NavigationBrand.module.css";

export default function NavigationBrand() {
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setBooting(false);
    }, 2200);

    return () => window.clearTimeout(t);
  }, []);

  return (
    <Link
      href="/"
      className={styles.brand}
      aria-label="Galactic Archive home"
    >
      <span className={styles.title}>
        Galactic Archive
      </span>

      <span
        className={`${styles.subtitle} ${
          booting ? styles.visible : styles.hidden
        }`}
        aria-hidden="true"
      >
        System Online
      </span>
    </Link>
  );
}