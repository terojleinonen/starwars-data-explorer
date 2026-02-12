"use client";

import type { SwapiType } from "@/components/types/swapi-types";
import styles from "./CartographyBackground.module.css";
import { useAtmosphere } from "@/components/layout/AtmosphereContext";

type Props = {
  category?: SwapiType;
  device: "desktop" | "tablet" | "mobile";
};

/* ======================================================
   RESPONSIVE MARKER LAYOUTS (Light Theme)
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
  const { activeHighlight } = useAtmosphere();

  const markers =
    MARKER_LAYOUTS[device][category ?? "people"] ?? [];

  const constellationId = `cons-${category ?? "people"}`;

  return (
    <svg
      viewBox="0 0 1440 1024"
      preserveAspectRatio="xMidYMid slice"
      className={styles.svg}
    >
      <defs>
        {/* Blueprint grid */}
        <pattern
          id="blueprintGrid"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 80 0 L 0 0 0 80"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.7"
          />
        </pattern>

        <pattern
          id="blueprintTicks"
          width="160"
          height="160"
          patternUnits="userSpaceOnUse"
        >
          <line x1="0" y1="0" x2="0" y2="160" stroke="currentColor" />
          <line x1="0" y1="0" x2="160" y2="0" stroke="currentColor" />
        </pattern>

        {/* Tactical orbit paths */}
        <pattern
          id="orbitsLight"
          width="420"
          height="240"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 120 Q210 40 420 120"
            stroke="currentColor"
            fill="none"
            strokeDasharray="5 5"
          />
        </pattern>

        {/* Sector marker */}
        <symbol id="sectorMarkerLight" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="4" fill="currentColor" />
          <circle
            cx="20"
            cy="20"
            r="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            opacity="0.7"
          />
        </symbol>

        {/* Paper style gradient */}
        <radialGradient id="paperTone" cx="50%" cy="50%" r="80%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.12" />
          <stop offset="60%" stopColor="currentColor" stopOpacity="0.06" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ===== BACKGROUND TECHNICAL GRID ===== */}
      <rect
        width="100%"
        height="100%"
        fill="url(#blueprintGrid)"
        className={styles.blueprintGrid}
      />

      <rect
        width="100%"
        height="100%"
        fill="url(#blueprintTicks)"
        className={styles.blueprintTicks}
      />

      {/* ===== ORBIT LINES ===== */}
      <rect
        width="100%"
        height="100%"
        fill="url(#orbitsLight)"
        className={styles.orbits}
      />

      {/* ===== PAPER TONAL WASH ===== */}
      <rect
        width="100%"
        height="100%"
        fill="url(#paperTone)"
        opacity="0.4"
      />

      {/* ===== INTERACTION LAYER ===== */}
      <g
        className={
          activeHighlight === category
            ? styles.highlighted
            : activeHighlight
            ? styles.dimmed
            : ""
        }
      >
        {/* ===== SECTOR MARKERS ===== */}
        <g className={styles.sectorMarkers}>
          {markers.map(([x, y], i) => (
            <g
              key={`${x}-${y}`}
              className={styles.marker}
              style={{
                transform: `translate(${x}px, ${y}px)`,
                animationDelay: `${i * 0.9}s`,
              }}
            >
              <use href="#sectorMarkerLight" />
            </g>
          ))}
        </g>

        {/* ===== CONSTELLATIONS ===== */}
        <g className={styles.constellation}>
          <use href={`#${constellationId}`} />
        </g>
      </g>

      {/* ===== LIGHT VIGNETTE ===== */}
      <radialGradient id="lightVignette" cx="50%" cy="50%" r="70%">
        <stop offset="50%" stopColor="white" stopOpacity="0" />
        <stop offset="100%" stopColor="white" stopOpacity="0.65" />
      </radialGradient>

      <rect
        width="100%"
        height="100%"
        fill="url(#lightVignette)"
      />
    </svg>
  );
}