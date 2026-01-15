"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { SwapiType } from "@/components/types/swapi-types";
import styles from "./AtmosphereLayer.module.css";

type Props = {
  /** Current page category (drives tint + mapping) */
  category?: SwapiType;
};

/**
 * Crossfades atmosphere between previous and next category on route change.
 * Extremely cheap: only opacity transitions (no layout thrash).
 */
export default function AtmosphereLayer({ category }: Props) {
  const pathname = usePathname();

  const prevCategoryRef = useRef<SwapiType | undefined>(category);
  const [prevCategory, setPrevCategory] = useState<SwapiType | undefined>(undefined);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const next = category;

    // first render: just lock in
    if (!prevCategoryRef.current) {
      prevCategoryRef.current = next;
      return;
    }

    // same category → no transition needed
    if (prevCategoryRef.current === next) return;

    // start transition (render both layers)
    setPrevCategory(prevCategoryRef.current);
    setIsTransitioning(true);

    prevCategoryRef.current = next;

    // end transition after CSS duration
    const ms = 650;
    const t = window.setTimeout(() => {
      setIsTransitioning(false);
      setPrevCategory(undefined);
    }, ms);

    return () => window.clearTimeout(t);
  }, [pathname, category]);

  // If no category given, just render a neutral layer
  const nextCategory = category;

  return (
    <div className={styles.root} aria-hidden="true">
      {/* Outgoing */}
      {isTransitioning && prevCategory && (
        <div
          className={`${styles.layer} ${styles.outgoing}`}
          data-category={prevCategory}
        >
          <OptimizedCartographySVG className={styles.svg} />
        </div>
      )}

      {/* Incoming / current */}
      <div
        className={`${styles.layer} ${isTransitioning ? styles.incoming : styles.steady}`}
        data-category={nextCategory}
      >
        <OptimizedCartographySVG className={styles.svg} />
      </div>
    </div>
  );
}

/* ---------------------------
   Inline SVG component
   (your optimized version)
---------------------------- */

function OptimizedCartographySVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 1024"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <pattern id="stars" width="160" height="160" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="30" r="1" />
          <circle cx="110" cy="50" r="0.8" />
          <circle cx="70" cy="120" r="0.6" />
        </pattern>

        <radialGradient id="planet-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="60%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="80%" stopColor="currentColor" stopOpacity="0.08" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="fade-mask" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="70%" stopColor="white" stopOpacity="0.7" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>

        <mask id="vertical-fade">
          <rect width="100%" height="100%" fill="url(#fade-mask)" />
        </mask>
      </defs>

      {/* Stars */}
      <rect width="100%" height="100%" fill="url(#stars)" opacity="0.45" />

      {/* Orbits */}
      <g fill="none" stroke="currentColor" strokeWidth="1" opacity="0.22">
        <path d="M -200 420 A 720 260 0 0 1 1640 420" />
        <path
          d="M -100 620 A 900 360 0 0 0 1540 520"
          strokeDasharray="4 8"
          strokeWidth="0.8"
        />
        <path
          d="M 200 300 A 600 180 0 0 1 1240 260"
          strokeWidth="0.6"
          opacity="0.5"
        />
      </g>

      {/* Planets */}
      <g mask="url(#vertical-fade)">
        <circle cx="720" cy="1100" r="620" fill="url(#planet-gradient)" />
        <circle cx="1180" cy="220" r="260" fill="url(#planet-gradient)" opacity="0.6" />
      </g>
    </svg>
  );
}