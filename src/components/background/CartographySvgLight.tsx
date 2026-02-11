"use client";

import type { SwapiType } from "@/components/types/swapi-types";
import styles from "./CartographyBackground.module.css";

type Props = {
  category?: SwapiType;
  device: "desktop" | "tablet" | "mobile";
};

/* ======================================================
   RESPONSIVE MARKER LAYOUTS
====================================================== */

const MARKER_LAYOUTS = {
  desktop: {
    people: [[420, 260], [520, 310], [640, 290], [980, 340]],
    planets: [[1080, 260], [1120, 320], [1000, 380], [960, 300]],
    films: [[260, 240], [520, 240], [740, 240], [960, 240]],
    starships: [[320, 700], [560, 560], [860, 430], [1160, 300]],
    vehicles: [[240, 860], [420, 820], [600, 860], [780, 820]],
    species: [[260, 360], [400, 360], [560, 500], [710, 520]],
  },

  tablet: {
    people: [[360, 240], [460, 280], [620, 260]],
    planets: [[860, 240], [900, 300], [780, 280]],
    films: [[240, 220], [540, 220], [840, 220]],
    starships: [[260, 620], [520, 500], [820, 380]],
    vehicles: [[200, 760], [460, 720], [720, 760]],
    species: [[240, 300], [520, 420]],
  },

  mobile: {
    people: [[200, 260], [380, 300]],
    planets: [[520, 240], [460, 300]],
    films: [[300, 220], [500, 220]],
    starships: [[240, 520], [440, 400]],
    vehicles: [[220, 640], [420, 680]],
    species: [[280, 320]],
  },
};

export default function CartographySvgLight({
  category,
  device,
}: Props) {
  const constellationId = `cons-${category ?? "people"}`;
  const markers = MARKER_LAYOUTS[device][category ?? "people"] ?? [];

  return (
    <svg
      viewBox="0 0 1440 1024"
      preserveAspectRatio="xMidYMid slice"
      className={styles.svg}
    >
      <defs>

        {/* ===== LIGHT BASE GRADIENT ===== */}
        <radialGradient id="lightBase" cx="50%" cy="40%" r="80%">
          <stop offset="0%" stopColor="#e8ecf2" />
          <stop offset="100%" stopColor="#cfd6e0" />
        </radialGradient>

        {/* ===== DARK STARS FOR LIGHT THEME ===== */}
        <pattern id="stars-light" width="180" height="180" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="30" r="0.6" fill="#2c3442" />
          <circle cx="90" cy="70" r="0.8" fill="#2c3442" />
          <circle cx="140" cy="140" r="0.7" fill="#2c3442" />
          <circle cx="40" cy="120" r="0.5" fill="#2c3442" />
        </pattern>

        {/* ===== BLUEPRINT GRID ===== */}
        <pattern id="blueprint" width="80" height="80" patternUnits="userSpaceOnUse">
          <path
            d="M80 0 L0 0 0 80"
            fill="none"
            stroke="#5b667a"
            strokeWidth="0.7"
            opacity="0.3"
          />
        </pattern>

        {/* ===== ORBIT / TECH LINES ===== */}
        <pattern id="orbits-light" width="480" height="240" patternUnits="userSpaceOnUse">
          <path
            d="M0 120 Q240 40 480 120"
            stroke="#4e5a70"
            fill="none"
            strokeDasharray="4 6"
            opacity="0.35"
          />
        </pattern>

        {/* ===== PLANET RIM – LIGHT VERSION ===== */}
        <radialGradient id="planetRimLight" cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="88%" stopColor="var(--category-accent)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--category-accent)" stopOpacity="0.65" />
        </radialGradient>

        {/* ===== PAPER / MAP SMUDGES ===== */}
        <radialGradient id="mapSmudge" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#6a7b92" stopOpacity="0.12" />
          <stop offset="60%" stopColor="#6a7b92" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#6a7b92" stopOpacity="0" />
        </radialGradient>

        {/* ===== SECTOR MARKER ===== */}
        <symbol id="sectorMarker" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="4" fill="currentColor" />
          <circle
            cx="20"
            cy="20"
            r="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            opacity="0.6"
          />
        </symbol>
      </defs>

      {/* ===== MAIN CANVAS BACKGROUND ===== */}
      <rect width="100%" height="100%" fill="url(#lightBase)" />

      {/* ===== STARS (DARK DOTS) ===== */}
      <rect
        width="100%"
        height="100%"
        fill="url(#stars-light)"
        className={styles.starsLight}
      />

      {/* ===== BLUEPRINT GRID ===== */}
      <rect
        width="100%"
        height="100%"
        fill="url(#blueprint)"
        className={styles.blueprintGrid}
      />

      {/* ===== TECHNICAL ORBIT LINES ===== */}
      <rect
        width="100%"
        height="100%"
        fill="url(#orbits-light)"
        className={styles.orbits}
      />

      {/* ===== PLANET ART ===== */}
      <g className={styles.planets}>
        <circle
          cx="1240"
          cy="880"
          r="420"
          fill="url(#planetRimLight)"
        />

        <circle
          cx="280"
          cy="260"
          r="140"
          fill="url(#planetRimLight)"
        />
      </g>

      {/* ===== MAP SMUDGES ===== */}
      <rect width="100%" height="100%" fill="url(#mapSmudge)" />

      {/* ===== RESPONSIVE MARKERS ===== */}
      <g className={styles.sectorMarkers}>
        {markers.map(([x, y], i) => (
          <g
            key={`${x}-${y}`}
            className={styles.marker}
            style={{
              transform: `translate(${x}px, ${y}px)`,
              animationDelay: `${i * 1.1}s`,
            }}
          >
            <use href="#sectorMarker" />
          </g>
        ))}
      </g>

      {/* ===== CONSTELLATIONS (if any) ===== */}
      <g className={styles.constellation}>
        <use href={`#${constellationId}`} />
      </g>
    </svg>
  );
}