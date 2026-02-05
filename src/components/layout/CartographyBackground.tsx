"use client";

import { useEffect, useRef, useState} from "react";
import type { SwapiType } from "@/components/types/swapi-types";
import styles from "./CartographyBackground.module.css";

type Props = {
  category?: SwapiType;
};

/* ======================================================
   BREAKPOINT DETECTION
====================================================== */

function getDeviceClass(): "desktop" | "tablet" | "mobile" {
  if (typeof window === "undefined") return "desktop";

  const w = window.innerWidth;

  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

/* ======================================================
   RESPONSIVE MARKER LAYOUTS
====================================================== */

const MARKER_LAYOUTS = {
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
    species: [
      [280, 320],
    ],
  },
};

export default function CartographyBackground({ category }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  /* Force re-render on resize so breakpoints update */
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const onResize = () => forceUpdate((v) => v + 1);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* Parallax scroll values */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    let raf: number;

    const onScroll = () => {
      raf = requestAnimationFrame(() => {
        const scrollY = window.scrollY || 0;

        el.style.setProperty("--p-small", `${scrollY * 0.03}px`);
        el.style.setProperty("--p-medium", `${scrollY * 0.06}px`);
        el.style.setProperty("--p-large", `${scrollY * 0.09}px`);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const device = getDeviceClass();

  const markers =
    MARKER_LAYOUTS[device][category ?? "people"] ?? [];

  const constellationId = `cons-${category ?? "people"}`;


  return (
    <div ref={rootRef} className={styles.cartography} aria-hidden>
      <svg
        viewBox="0 0 1440 1024"
        preserveAspectRatio="xMidYMid slice"
        className={styles.svg}
      >
        <defs>
          {/* ===== STAR CHART POINTS ===== */}
          <pattern id="chart-stars" width="120" height="120" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="30" r="0.9" />
            <circle cx="80" cy="60" r="0.6" />
            <circle cx="60" cy="90" r="0.7" />
            <circle cx="110" cy="20" r="0.8" />
          </pattern>

          {/* ===== ORBIT LINES ===== */}
          <pattern id="orbits" width="480" height="240" patternUnits="userSpaceOnUse">
            <path d="M0 120 Q240 40 480 120" stroke="currentColor" fill="none" strokeDasharray="4 6" />
          </pattern>

          {/* ===== PLANET SHADING – SCHEMATIC ===== */}
          <radialGradient id="schematicPlanet" cx="45%" cy="45%" r="65%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
            <stop offset="70%" stopColor="currentColor" stopOpacity="0.08" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>

          {/* ===== PAPER SMUDGES (NEBULA REPLACEMENT) ===== */}
          <radialGradient id="paperSmudge" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.14" />
            <stop offset="60%" stopColor="currentColor" stopOpacity="0.06" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>

          {/* ===== BLUEPRINT GRID ===== */}
          <pattern id="blueprintGrid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
            />            
          </pattern>

          {/* Measurement ticks */}
          <pattern id="blueprintTicks" width="160" height="160" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="160" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="0" x2="160" y2="0" stroke="currentColor" strokeWidth="1" />
          </pattern>

          {/* ===== COORDINATE LABELS ===== */}
          <symbol id="coordLabels" viewBox="0 0 1440 1024">
            <g
              fontFamily="monospace"
              fontSize="10"
              letterSpacing="0.05em"
              fill="currentColor"
            >
            {/* Top edge */}
              <text x="80" y="20">A-12</text>
              <text x="260" y="20">B-14</text>
              <text x="440" y="20">C-18</text>
              <text x="620" y="20">D-21</text>
              <text x="800" y="20">E-24</text>
              <text x="980" y="20">F-28</text>
              <text x="1160" y="20">G-30</text>

            {/* Left edge */}
              <text x="10" y="100">01</text>
              <text x="10" y="260">02</text>
              <text x="10" y="420">03</text>
              <text x="10" y="580">04</text>
              <text x="10" y="740">05</text>
              <text x="10" y="900">06</text>

            {/* Bottom edge */}
              <text x="80" y="1010">SECTOR-7</text>
              <text x="620" y="1010">GRID-ALPHA</text>
              <text x="1080" y="1010">ZONE-9</text>

            {/* Right edge */}
              <text x="1380" y="100">X1</text>
              <text x="1380" y="260">X2</text>
              <text x="1380" y="420">X3</text>
              <text x="1380" y="580">X4</text>
              <text x="1380" y="740">X5</text>
              <text x="1380" y="900">X6</text>
            </g>
          </symbol>

          {/* ===== SCANNING CURSOR ===== */}
          <symbol id="scanner" viewBox="0 0 1440 1024">
            <linearGradient id="scanBeam" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
              <stop offset="50%" stopColor="currentColor" stopOpacity="0.35" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>

            <rect
              x="0"
              y="0"
              width="160"
              height="1024"
              fill="url(#scanBeam)"
            />
          </symbol>

          {/* ===== SECTOR MARKER SYMBOL ===== */}
          <symbol id="sectorMarker" viewBox="0 0 40 40">
            <circle
              cx="20"              
              cy="20"
              r="4"
              fill="currentColor"
            />

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

        {/* ===== STAR CHART BACKGROUND ===== */}
        <rect
          width="100%"
          height="100%"
          fill="url(#chart-stars)"
          className={styles.chartStars}
        />

        {/* ===== TECHNICAL ORBIT LINES ===== */}
        <rect
          width="100%"
          height="100%"
          fill="url(#orbits)"
          className={styles.orbits}
        />
        {/* ===== TECHNICAL ORBIT LINES ===== */}
        <rect
          width="100%"
          height="100%"
          fill="url(#orbits)"
          className={styles.orbits}
        />
        {/* ===== BLUEPRINT GRID (LIGHT THEME ONLY) ===== */}
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

        {/* ===== COORDINATE LABELS (LIGHT THEME ONLY) ===== */}
        <g className={styles.coordinates}>
          <use href="#coordLabels" />
        </g>

        {/* ===== SCANNING CURSOR (LIGHT THEME ONLY) ===== */}
        <g className={styles.scanner}>
          <use href="#scanner" />
        </g>

        
        {/* ===== PULSING SECTOR MARKERS ===== */}
        {/* RESPONSIVE MARKERS */}
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


        {/* ===== PAPER SMUDGE LAYERS ===== */}
        <g className={styles.paperLayer}>
          <rect width="100%" height="100%" fill="url(#paperSmudge)" />
        </g>

        {/* ===== PLANETS – SCHEMATIC STYLE ===== */}
        <g className={styles.planets}>
          <g className={styles.planetLarge}>
            <circle cx="1220" cy="860" r="420" fill="url(#schematicPlanet)" />
            <circle cx="1220" cy="860" r="420" className={styles.planetOutline} />
          </g>

          <g className={styles.planetMedium}>
            <circle cx="1080" cy="240" r="240" fill="url(#schematicPlanet)" />
            <circle cx="1080" cy="240" r="240" className={styles.planetOutline} />
          </g>

          <g className={styles.planetSmall}>
            <circle cx="260" cy="200" r="120" fill="url(#schematicPlanet)" />
            <circle cx="260" cy="200" r="120" className={styles.planetOutline} />
          </g>
        </g>

        {/* ===== CONSTELLATIONS ===== */}
        <g className={styles.constellation}>
          <use href={`#${constellationId}`} />
        </g>
      </svg>
    </div>
  );
}