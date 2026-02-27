"use client";

import useParallax from "@/hooks/motion/useParallax";
import styles from "../styles/PlanetLayer.module.css";

export default function PlanetLayer() {
  const ref = useParallax(10);

  return (
    <div ref={ref} className={styles.planet} />
  );
}