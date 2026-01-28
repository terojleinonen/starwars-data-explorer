"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./AtmosphereLayer.module.css";
import type { SwapiType } from "@/components/types/swapi-types";

type Props = {
  category?: SwapiType;
};

export default function AtmosphereLayer({ category }: Props) {
  const pathname = usePathname();
  const prev = useRef<SwapiType | undefined>(category);

  const [from, setFrom] = useState<SwapiType | undefined>();
  const [to, setTo] = useState<SwapiType | undefined>(category);
  const [transitioning, setTransitioning] = useState(false);

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