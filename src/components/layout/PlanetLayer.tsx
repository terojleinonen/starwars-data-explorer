"use client";

import useParallax from "@/hooks/useParallax";
import styles from "./PlanetLayer.module.css";

export default function PlanetLayer() {
  const ref = useParallax(10);

  return (
    <div ref={ref} className={styles.planet} />
  );
}