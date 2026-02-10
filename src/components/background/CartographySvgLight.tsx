"use client";

import type { SwapiType } from "@/components/types/swapi-types";
import styles from "./CartographyBackground.module.css";

type Props = {
  category?: SwapiType;
  device: "desktop" | "tablet" | "mobile";
};

export default function CartographySvgLight({ category }: Props) {
  const constellationId = `cons-${category ?? "people"}`;

  return (
    <svg
      viewBox="0 0 1440 1024"
      preserveAspectRatio="xMidYMid slice"
      className={styles.svg}
    >
      <defs>
        <pattern id="blueprint-grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path
            d="M 80 0 L 0 0 0 80"
            fill="none"
            stroke="#b0b7c0"
            strokeWidth="0.6"
          />
        </pattern>

        <pattern id="stars-light" width="160" height="160" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="30" r="0.9" fill="#6b7280" opacity="0.5" />
          <circle cx="100" cy="60" r="0.6" fill="#6b7280" opacity="0.4" />
          <circle cx="70" cy="120" r="0.7" fill="#6b7280" opacity="0.45" />
        </pattern>

        <radialGradient id="planetLight" cx="45%" cy="45%" r="65%">
          <stop offset="0%" stopColor="#a3acb8" stopOpacity="0.25" />
          <stop offset="70%" stopColor="#a3acb8" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#a3acb8" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect
        width="100%"
        height="100%"
        fill="url(#blueprint-grid)"
        opacity="0.5"
      />

      <rect
        width="100%"
        height="100%"
        fill="url(#stars-light)"
      />

      <g className={styles.planets}>
        <g className={styles.planetLarge}>
          <circle cx="1180" cy="840" r="380" fill="url(#planetLight)" />
        </g>

        <g className={styles.planetSmall}>
          <circle cx="300" cy="220" r="140" fill="url(#planetLight)" />
        </g>
      </g>

      <g className={styles.constellation}>
        <use href={`#${constellationId}`} />
      </g>
    </svg>
  );
}