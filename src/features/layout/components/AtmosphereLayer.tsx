"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/AtmosphereLayer.module.css";

type Props = {
  category?: string;
};

export default function AtmosphereLayer({ category }: Props) {
  const pathname = usePathname();
  const prev = useRef<string | undefined>(category);

  const [from, setFrom] = useState<string | undefined>();
  const [to, setTo] = useState<string | undefined>(category);
  const [transitioning, setTransitioning] = useState(false);

console.log("AtmosphereLayer category:", category)

  useEffect(() => {
    if (!prev.current || prev.current === category) return;

    setFrom(prev.current);
    setTo(category);
    setTransitioning(true);

    const t = setTimeout(() => {
      setFrom(undefined);
      setTransitioning(false);
    }, 700);

    prev.current = category;
    return () => clearTimeout(t);
  }, [pathname, category]);

  return (
    <div className={styles.root} aria-hidden="true">
      {transitioning && from && (
        <div
          className={`${styles.layer} ${styles.fadeOut}`}
          data-category={from}
        />
      )}

      <div
        className={`${styles.layer} ${
          transitioning ? styles.fadeIn : styles.steady
        }`}
        data-category={to}
      />
    </div>
  );
}