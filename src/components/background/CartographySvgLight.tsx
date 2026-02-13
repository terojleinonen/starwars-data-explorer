"use client";

import type { SwapiType } from "@/components/types/swapi-types";
import styles from "./CartographyBackground.module.css";

type Props = {
  category?: SwapiType;
  device: "desktop" | "tablet" | "mobile";
};

/* ======================================================
   RESPONSIVE MARKER LAYOUTS (LIGHT THEME)
====================================================== */

const MARKER_LAYOUTS: Record<
  Props["device"],
  Record<SwapiType, [number, number][]>
> = {
  desktop: {
    people: [
      [420, 260],
      [520, 310],
      [640, 290],
      [980, 340],
    ],
    planets: [
      [1080, 260],
      [1120, 320],
      [1000, 380],
      [960, 300],
    ],
    films: [
      [260, 240],
      [520, 240],
      [740, 240],
      [960, 240],
      [1180, 240],
    ],
    starships: [
      [320, 700],
      [560, 560],
      [860, 430],
      [1160, 300],
    ],
    vehicles: [
      [240, 860],
      [420, 820],
      [600, 860],
      [780, 820],
    ],
    species: [
      [260, 360],
      [400, 360],
      [560, 500],
      [710, 520],
    ],
  },

  tablet: {
    people: [
      [360, 240],
      [460, 280],
      [620, 260],
    ],
    planets: [
      [860, 240],
      [900, 300],
      [780, 280],
    ],
    films: [
      [240, 220],
      [540, 220],
      [840, 220],
    ],
    starships: [
      [260, 620],
      [520, 500],
      [820, 380],
    ],
    vehicles: [
      [200, 760],
      [460, 720],
      [720, 760],
    ],
    species: [
      [240, 300],
      [520, 420],
    ],
  },

  mobile: {
    people: [
      [200, 260],
      [380, 300],
    ],
    planets: [
      [520, 240],
      [460, 300],
    ],
    films: [
      [300, 220],
      [500, 220],
    ],
    starships: [
      [240, 520],
      [440, 400],
    ],
    vehicles: [
      [220, 640],
      [420, 680],
    ],
    species: [[280, 320]],
  },
};

export default function CartographySvgLight({ category, device }: Props) {
  const cat: SwapiType = category ?? "people";
  const markers = MARKER_LAYOUTS[device][cat] ?? [];

  return (
    <svg
      viewBox="0 0 1440 1024"
      preserveAspectRatio="xMidYMid slice"
      className={styles.svg}
      aria-hidden="true"
    >
      <defs>
        {/* =========================
           PAPER BASE + VIGNETTE
        ========================= */}
        <radialGradient id="paperBase" cx="45%" cy="30%" r="85%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.06" />
          <stop offset="55%" stopColor="currentColor" stopOpacity="0.03" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.08" />
        </radialGradient>

        {/* =========================
           INK STAR DUST (PRINTED)
        ========================= */}
        <pattern
          id="inkStarsFine"
          width="140"
          height="140"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="22" cy="28" r="0.7" />
          <circle cx="112" cy="46" r="0.55" />
          <circle cx="64" cy="108" r="0.6" />
          <circle cx="96" cy="118" r="0.45" />
        </pattern>

        <pattern
          id="inkStarsCoarse"
          width="420"
          height="420"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="70" cy="80" r="1.4" />
          <circle cx="300" cy="140" r="1.2" />
          <circle cx="210" cy="320" r="1.0" />
          <circle cx="340" cy="360" r="1.1" />
        </pattern>

        {/* =========================
           BLUEPRINT GRID + TICKS
        ========================= */}
        <pattern
          id="gridMajor"
          width="160"
          height="160"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 160 0 L 0 0 0 160"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.12"
          />
        </pattern>

        <pattern
          id="gridMinor"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
            opacity="0.08"
          />
        </pattern>

        <pattern
          id="ticks"
          width="240"
          height="240"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 0 L0 18 M0 0 L18 0"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.18"
          />
          <path
            d="M0 0 L0 36 M0 0 L36 0"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.10"
          />
        </pattern>

        {/* =========================
           HYPERLANE ROUTES
        ========================= */}
        <linearGradient id="routeInk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="45%" stopColor="currentColor" stopOpacity="0.30" />
          <stop offset="55%" stopColor="currentColor" stopOpacity="0.30" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>

        {/* =========================
           LIGHT SCAN BEAM
        ========================= */}
        <linearGradient id="scanBeamLight" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.28" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>

        {/* =========================
           TACTICAL MARKER
        ========================= */}
        <symbol id="marker" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="3.2" fill="currentColor" />
          <circle
            cx="20"
            cy="20"
            r="11"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            opacity="0.7"
          />
          <path
            d="M20 6 V12 M20 28 V34 M6 20 H12 M28 20 H34"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.55"
          />
        </symbol>

        {/* =========================
           EDGE COORDINATE LABELS
        ========================= */}
        <symbol id="coordLabels" viewBox="0 0 1440 1024">
          <g
            fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
            fontSize="10"
            letterSpacing="0.08em"
            fill="currentColor"
            opacity="0.55"
          >
            {/* Top */}
            <text x="80" y="20">A-12</text>
            <text x="260" y="20">B-14</text>
            <text x="440" y="20">C-18</text>
            <text x="620" y="20">D-21</text>
            <text x="800" y="20">E-24</text>
            <text x="980" y="20">F-28</text>
            <text x="1160" y="20">G-30</text>

            {/* Left */}
            <text x="10" y="100">01</text>
            <text x="10" y="260">02</text>
            <text x="10" y="420">03</text>
            <text x="10" y="580">04</text>
            <text x="10" y="740">05</text>
            <text x="10" y="900">06</text>

            {/* Bottom */}
            <text x="80" y="1010">SECTOR-7</text>
            <text x="620" y="1010">GRID-ALPHA</text>
            <text x="1080" y="1010">ZONE-9</text>

            {/* Right */}
            <text x="1380" y="100">X1</text>
            <text x="1380" y="260">X2</text>
            <text x="1380" y="420">X3</text>
            <text x="1380" y="580">X4</text>
            <text x="1380" y="740">X5</text>
            <text x="1380" y="900">X6</text>
          </g>
        </symbol>
      </defs>

      {/* ==================================================
         PAPER + INK BASE
      ================================================== */}
      <rect width="100%" height="100%" fill="url(#paperBase)" className={styles.paperLayer} />

      {/* ==================================================
         STARS (PRINTED INK)
      ================================================== */}
      <g className={styles.starsLight}>
        <rect width="100%" height="100%" fill="url(#inkStarsFine)" />
        <rect width="100%" height="100%" fill="url(#inkStarsCoarse)" opacity="0.55" />
      </g>

      {/* ==================================================
         GRID (TECHNICAL / MILITARY)
      ================================================== */}
      <g className={styles.blueprintGrid}>
        <rect width="100%" height="100%" fill="url(#gridMinor)" />
        <rect width="100%" height="100%" fill="url(#gridMajor)" />
      </g>

      <rect width="100%" height="100%" fill="url(#ticks)" className={styles.blueprintTicks} />

      {/* ==================================================
         COORDS
      ================================================== */}
      <g className={styles.coordinates}>
        <use href="#coordLabels" />
      </g>

      {/* ==================================================
         HYPERLANE ROUTES (SUBTLE)
      ================================================== */}
      <g className={`${styles.orbits} ${styles.pulse}`}>
        <path
          d="M160 760 Q420 600 760 540 T1260 340"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="6 10"
          opacity="0.35"
        />
        <path
          d="M220 300 Q520 420 860 460 T1180 740"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 9"
          opacity="0.26"
        />
        <path
          d="M340 220 Q620 360 940 260"
          fill="none"
          stroke="url(#routeInk)"
          strokeWidth="18"
          opacity="0.10"
        />
      </g>

      {/* ==================================================
         LIGHT SCAN (VERY RESTRAINED)
      ================================================== */}
      <g className={styles.radarSystemLight}>
        <rect x="-200" y="0" width="220" height="1024" fill="url(#scanBeamLight)" />
      </g>

      {/* ==================================================
         SECTOR MARKERS (RESPONSIVE)
         NOTE: class `sector-${cat}` is intentionally GLOBAL
               (your CSS targets it)
      ================================================== */}
      <g className={`${styles.sectorMarkers} ${`sector-${cat}`}`}>
        {markers.map(([x, y], i) => (
          <g
            key={`${x}-${y}-${i}`}
            className={styles.marker}
            style={{
              transform: `translate(${x}px, ${y}px)`,
              animationDelay: `${i * 0.9}s`,
            }}
          >
            <use href="#marker" />
          </g>
        ))}
      </g>

      {/* ==================================================
         OPTIONAL: FAINT SCHEMATIC PLANETS (INK RINGS)
         (kept subtle to avoid “blue balloons”)
      ================================================== */}
      <g className={styles.planets} opacity="0.18">
        <g className={styles.planetLarge}>
          <circle cx="1220" cy="860" r="420" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="1220" cy="860" r="280" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.65" />
        </g>
        <g className={styles.planetSmall}>
          <circle cx="260" cy="200" r="120" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="260" cy="200" r="72" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.65" />
        </g>
      </g>
    </svg>
  );
}