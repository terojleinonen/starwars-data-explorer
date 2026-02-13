"use client";

import type { SwapiType } from "@/components/types/swapi-types";
import styles from "./CartographyBackground.module.css";
import { useAtmosphere } from "@/components/layout/AtmosphereContext";
import { useEffect, useState } from "react";

type Props = {
  category?: SwapiType;
  device: "desktop" | "tablet" | "mobile";
};

/* ======================================================
   RESPONSIVE MARKER LAYOUTS
====================================================== */

const MARKER_LAYOUTS: Record<
  "desktop" | "tablet" | "mobile",
  Record<SwapiType, Array<[number, number]>>
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

/* ======================================================
   Component
====================================================== */

export default function CartographySvgDark({ category, device }: Props) {
  const cat: SwapiType = category ?? "people";
  const { activeHighlight } = useAtmosphere();
  const markers = MARKER_LAYOUTS[device][cat] ?? [];
  const constellationId = `cons-${cat}`;

  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);

  const highlightClass =
    activeHighlight === cat
      ? styles.highlighted
      : activeHighlight
      ? styles.dimmed
      : "";

  return (
    <svg
      viewBox="0 0 1440 1024"
      preserveAspectRatio="xMidYMid slice"
      className={styles.svg}
      aria-hidden="true"
    >
      <defs>
        {/* =========================
           Base space gradients
        ========================= */}
        <radialGradient id="spaceBase" cx="50%" cy="50%" r="80%">
          <stop offset="0%" stopColor="#080f1c" stopOpacity="1" />
          <stop offset="55%" stopColor="#050a12" stopOpacity="1" />
          <stop offset="100%" stopColor="#020408" stopOpacity="1" />
        </radialGradient>

        {/* subtle core haze (NOT a wash) */}
        <radialGradient id="coreHaze" cx="42%" cy="46%" r="55%">
          <stop offset="0%" stopColor="#0b1730" stopOpacity="0.26" />
          <stop offset="45%" stopColor="#0b1730" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#0b1730" stopOpacity="0" />
        </radialGradient>

        {/* =========================
           Star patterns (SVG-only)
           IMPORTANT: keep star colors here
        ========================= */}
        <pattern
          id="starsFar"
          width="140"
          height="140"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="24" cy="34" r="0.55" fill="#5d6878" opacity="0.55" />
          <circle cx="96" cy="52" r="0.45" fill="#566173" opacity="0.5" />
          <circle cx="72" cy="108" r="0.4" fill="#516073" opacity="0.45" />
          <circle cx="124" cy="118" r="0.45" fill="#586578" opacity="0.5" />
        </pattern>

        <pattern
          id="starsMid"
          width="220"
          height="220"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="44" cy="62" r="0.9" fill="#8794a6" opacity="0.55" />
          <circle cx="168" cy="88" r="0.8" fill="#7f8ca0" opacity="0.52" />
          <circle cx="108" cy="170" r="0.7" fill="#74829a" opacity="0.48" />
        </pattern>

        <pattern
          id="starsNear"
          width="360"
          height="360"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="78" cy="92" r="1.35" fill="#cfd7e6" opacity="0.62" />
          <circle cx="252" cy="132" r="1.15" fill="#bac6da" opacity="0.56" />
          <circle cx="182" cy="278" r="1.05" fill="#b2bed4" opacity="0.52" />
        </pattern>

        {/* =========================
           Hex grids
        ========================= */}
        <pattern
          id="hexGrid"
          width="200"
          height="173.2"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M100 0 L200 57.7 L200 115.4 L100 173.2 L0 115.4 L0 57.7 Z"
            fill="none"
            stroke="#223149"
            strokeWidth="0.9"
            opacity="0.22"
          />
        </pattern>

        <pattern
          id="hexGridSmall"
          width="100"
          height="86.6"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M50 0 L100 28.8 L100 57.7 L50 86.6 L0 57.7 L0 28.8 Z"
            fill="none"
            stroke="#1d2a3f"
            strokeWidth="0.6"
            opacity="0.18"
          />
        </pattern>

        {/* =========================
           Hyperlane glow stroke
        ========================= */}
        <linearGradient id="laneStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--category-accent)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--category-accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--category-accent)" stopOpacity="0" />
        </linearGradient>

        {/* moving dot symbol */}
        <circle id="laneDot" r="2.6" fill="var(--category-accent)" opacity="0.7" />

        {/* =========================
           Sector marker symbol
        ========================= */}
        <symbol id="sectorMarker" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="3.3" fill="var(--category-accent)" opacity="0.95" />
          <circle
            cx="20"
            cy="20"
            r="12"
            fill="none"
            stroke="var(--category-accent)"
            strokeWidth="1.2"
            opacity="0.55"
          />
        </symbol>

        {/* =========================
           Planet shading (NOT a blob)
           - body is dark
           - atmosphere is subtle
           - rim uses category accent
        ========================= */}
        <radialGradient id="planetBody" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#121c2c" stopOpacity="0.85" />
          <stop offset="55%" stopColor="#0b1220" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#050915" stopOpacity="1" />
        </radialGradient>

        <radialGradient id="planetAtmosphere" cx="45%" cy="40%" r="72%">
          <stop offset="0%" stopColor="#2b3a52" stopOpacity="0.10" />
          <stop offset="60%" stopColor="#2b3a52" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#2b3a52" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="planetRim" cx="50%" cy="50%" r="50%">
          <stop offset="72%" stopColor="var(--category-accent)" stopOpacity="0" />
          <stop offset="90%" stopColor="var(--category-accent)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--category-accent)" stopOpacity="0.42" />
        </radialGradient>

        {/* vignette */}
        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="62%" stopColor="black" stopOpacity="0" />
          <stop offset="100%" stopColor="black" stopOpacity="0.62" />
        </radialGradient>

        {/* radar sweep */}
        <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--category-accent)" stopOpacity="0.10" />
          <stop offset="70%" stopColor="var(--category-accent)" stopOpacity="0.04" />
          <stop offset="100%" stopColor="var(--category-accent)" stopOpacity="0" />
        </radialGradient>

        <mask id="sweepMask">
          <rect width="100%" height="100%" fill="black" />
          {/* a wedge mask */}
          <path
            d="M720 512 L1440 512 A720 720 0 0 0 720 -208 Z"
            fill="white"
          />
        </mask>
      </defs>

      {/* ======================================================
         1) Base space + haze
      ======================================================= */}
      <rect width="100%" height="100%" fill="url(#spaceBase)" />
      <rect width="100%" height="100%" fill="url(#coreHaze)" />

      {/* ======================================================
         2) Stars (SVG-only, controlled)
      ======================================================= */}
      <rect width="100%" height="100%" fill="url(#starsFar)" />
      <rect width="100%" height="100%" fill="url(#starsMid)" />
      <rect width="100%" height="100%" fill="url(#starsNear)" />

      {/* ======================================================
         3) Hex grids (subtle)
      ======================================================= */}
      <rect width="100%" height="100%" fill="url(#hexGrid)" className={styles.hexGrid} />
      <rect
        width="100%"
        height="100%"
        fill="url(#hexGridSmall)"
        className={styles.hexGridSmall}
      />

      {/* ======================================================
         4) Hyperlanes (subtle)
      ======================================================= */}
      <g className={styles.hyperlanes}>
        <path
          id="routeA"
          d="M180 780 Q420 620 760 540 T1220 320"
          fill="none"
          stroke="url(#laneStroke)"
          strokeWidth="1.2"
          strokeDasharray="6 10"
          opacity="0.38"
        />
        <path
          id="routeB"
          d="M240 300 Q520 420 860 460 T1180 740"
          fill="none"
          stroke="url(#laneStroke)"
          strokeWidth="1.1"
          strokeDasharray="6 10"
          opacity="0.28"
        />

        {!reduceMotion && (
          <g className={styles.laneTraffic}>
            {/* only 2 travelers total */}
            <use href="#laneDot">
              <animateMotion dur="18s" repeatCount="indefinite">
                <mpath href="#routeA" />
              </animateMotion>
            </use>

            <use href="#laneDot" opacity="0.55">
              <animateMotion dur="22s" repeatCount="indefinite" begin="6s">
                <mpath href="#routeB" />
              </animateMotion>
            </use>
          </g>
        )}
      </g>

      {/* ======================================================
         5) Planet (large, off-screen, shaded)
      ======================================================= */}
      <g className={styles.planets} aria-hidden="true">
        {/* large planet bottom-right (cropped on purpose) */}
        <g className={styles.planetLarge}>
          <circle cx="1260" cy="900" r="520" fill="url(#planetBody)" />
          <circle cx="1260" cy="900" r="520" fill="url(#planetAtmosphere)" opacity="0.9" />
          <circle cx="1260" cy="900" r="520" fill="url(#planetRim)" />
        </g>
      </g>

      {/* ======================================================
         6) Radar sweep (very restrained)
      ======================================================= */}
      {!reduceMotion && (
        <g className={styles.radarSystem} opacity="0.18" style={{ mixBlendMode: "screen" }}>
          <g className={styles.sweepContainer}>
            <circle
              cx="720"
              cy="512"
              r="820"
              fill="url(#radarSweep)"
              mask="url(#sweepMask)"
              className={styles.sweep}
            />
          </g>
        </g>
      )}

      {/* ======================================================
         7) Sector markers (category responsive)
      ======================================================= */}
      <g className={`${styles.sectorMarkers} ${highlightClass}`}>
        {markers.map(([x, y], i) => (
          <g
            key={`${x}-${y}`}
            className={styles.marker}
            style={{
              transform: `translate(${x}px, ${y}px)`,
              animationDelay: `${i * 1.0}s`,
            }}
          >
            <use href="#sectorMarker" />
          </g>
        ))}
      </g>

      {/* ======================================================
         8) Constellation overlay (if defined elsewhere)
      ======================================================= */}
      <g className={`${styles.constellation} ${highlightClass}`}>
        <use href={`#${constellationId}`} />
      </g>

      {/* ======================================================
         9) Vignette
      ======================================================= */}
      <rect width="100%" height="100%" fill="url(#vignette)" />
    </svg>
  );
}