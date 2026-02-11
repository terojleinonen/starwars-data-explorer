"use client";

import type { SwapiType } from "@/components/types/swapi-types";
import styles from "./CartographyBackground.module.css";
import { useAtmosphere } from "@/components/layout/AtmosphereContext";

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

export default function CartographySvgDark({ category, device }: Props) {
  const constellationId = `cons-${category ?? "people"}`;
  const { activeHighlight } = useAtmosphere();

  const markers =
    MARKER_LAYOUTS[device][category ?? "people"] ?? [];

  return (
    <svg
      viewBox="0 0 1440 1024"
      preserveAspectRatio="xMidYMid slice"
      className={styles.svg}
    >
      <defs>
        {/* ===== STAR PATTERNS ===== */}

        <pattern id="stars-far" width="120" height="120" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="30" r="0.5" fill="currentColor" />
          <circle cx="80" cy="90" r="0.4" fill="currentColor" />
        </pattern>

        <pattern id="stars-mid" width="160" height="160" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="30" r="0.9" fill="currentColor" />
          <circle cx="110" cy="50" r="0.8" fill="currentColor" />
          <circle cx="70" cy="120" r="0.7" fill="currentColor" />
        </pattern>

        <pattern id="stars-near" width="240" height="240" patternUnits="userSpaceOnUse">
          <circle cx="40" cy="60" r="1.4" fill="currentColor" />
          <circle cx="180" cy="120" r="1.2" fill="currentColor" />
          <circle cx="90" cy="200" r="1.0" fill="currentColor" />
        </pattern>

        {/* ===== NEBULA ===== */}
        <radialGradient id="deepNebula" cx="50%" cy="50%" r="80%">
          <stop offset="0%" stopColor="#0a1020" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#0a1020" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0a1020" stopOpacity="0" />
        </radialGradient>

        {/* ===== HEX GRID ===== */}
        <pattern id="hexGrid" width="200" height="173.2" patternUnits="userSpaceOnUse">
          <path
            d="M100 0 L200 57.7 L200 115.4 L100 173.2 L0 115.4 L0 57.7 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.9"
          />
        </pattern>

        <pattern id="hexGridSmall" width="100" height="86.6" patternUnits="userSpaceOnUse">
          <path
            d="M50 0 L100 28.8 L100 57.7 L50 86.6 L0 57.7 L0 28.8 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
          />
        </pattern>

        {/* ===== PLANET RIM ===== */}
        <radialGradient id="planetRimStrong" cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="88%" stopColor="var(--category-accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--category-accent)" stopOpacity="0.85" />
        </radialGradient>

        {/* ===== HYPERLANE ===== */}
        <linearGradient id="laneGlow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>

        <circle id="laneDot" r="3" fill="currentColor" />

        {/* ===== RADAR ===== */}
        <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="70%" stopColor="currentColor" stopOpacity="0.06" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>

        <mask id="sweepMask">
          <rect width="100%" height="100%" fill="black" />
          <path
            d="M720 512 L1440 512 A720 720 0 0 0 720 -208 Z"
            fill="white"
          />
        </mask>

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
            opacity="0.7"
          />
        </symbol>
      </defs>
      
      {/* ===== STAR FIELD ===== */}
      <rect width="100%" height="100%" fill="url(#stars-far)" className={styles.starsFar} />
      <rect width="100%" height="100%" fill="url(#stars-mid)" className={styles.starsMid} />
      <rect width="100%" height="100%" fill="url(#stars-near)" className={styles.starsNear} />

      {/* ===== NEBULA ===== */}
      <rect width="100%" height="100%" fill="url(#deepNebula)" />

      {/* ===== HEX GRID ===== */}
      <rect width="100%" height="100%" fill="url(#hexGrid)" className={styles.hexGrid} />
      <rect width="100%" height="100%" fill="url(#hexGridSmall)" className={styles.hexGridSmall} />

      {/* ===== PLANET ===== */}
      <circle cx="1220" cy="860" r="420" fill="url(#planetRimStrong)" />

      {/* ===== RADAR SWEEP ===== */}
      <g className={styles.radarSystem}>
        <circle
          cx="720"
          cy="512"
          r="820"
          fill="url(#radarSweep)"
          mask="url(#sweepMask)"
          className={styles.sweep}
        />
      </g>

      {/* ===== SECTOR MARKERS ===== */}
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

      {/* ===== CONSTELLATIONS ===== */}
      <g className={styles.constellation}>
        <use href={`#${constellationId}`} />
      </g>

      {/* ===== VIGNETTE ===== */}
      <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
        <stop offset="60%" stopColor="black" stopOpacity="0" />
        <stop offset="100%" stopColor="black" stopOpacity="0.65" />
      </radialGradient>

      <rect width="100%" height="100%" fill="url(#vignette)" />
    </svg>
  );
}
