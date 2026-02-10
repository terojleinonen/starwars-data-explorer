"use client";

import type { SwapiType } from "@/components/types/swapi-types";
import styles from "./CartographyBackground.module.css";
import { useAtmosphere } from "@/components/layout/AtmosphereContext";

type Props = {
  category?: SwapiType;
  device: "desktop" | "tablet" | "mobile";
};

export default function CartographySvgDark({ category }: Props) {
  const constellationId = `cons-${category ?? "people"}`;
  const { activeHighlight } = useAtmosphere();


  return (
    <svg
      viewBox="0 0 1440 1024"
      preserveAspectRatio="xMidYMid slice"
      className={styles.svg}
    >
      <defs>
        <pattern id="stars-dark" width="120" height="120" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="30" r="0.9" fill="#ffffff" opacity="0.9" />
          <circle cx="80" cy="60" r="0.6" fill="#ffffff" opacity="0.7" />
          <circle cx="60" cy="90" r="0.7" fill="#ffffff" opacity="0.8" />
        </pattern>

        <radialGradient id="planetDark" cx="45%" cy="45%" r="65%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="70%" stopColor="currentColor" stopOpacity="0.08" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>

        {/* ===== SECTOR HEX GRID ===== */}
<pattern
  id="hexGrid"
  width="200"
  height="173.2"
  patternUnits="userSpaceOnUse"
  patternTransform="scale(1)"
>
  <path
    d="M100 0 L200 57.7 L200 115.4 L100 173.2 L0 115.4 L0 57.7 Z"
    fill="none"
    stroke="currentColor"
    strokeWidth="0.9"
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
    stroke="currentColor"
    strokeWidth="0.6"
  />
</pattern>

<symbol id="sectorHighlight" viewBox="0 0 200 173.2">
  <path
    d="M100 0 L200 57.7 L200 115.4 L100 173.2 L0 115.4 L0 57.7 Z"
    fill="currentColor"
    opacity="0.12"
  />
</symbol>

{/* ===== HYPERLANE PATH STYLE ===== */}
<linearGradient id="laneGlow" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
  <stop offset="50%" stopColor="currentColor" stopOpacity="0.35" />
  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
</linearGradient>

{/* Moving marker */}
<circle id="laneDot" r="3" fill="currentColor" />

{/* ===== RADAR SWEEP GRADIENT ===== */}
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

{/* ===== ACTIVE SECTOR GRADIENTS ===== */}
<radialGradient id="sectorField" cx="50%" cy="50%" r="60%">
  <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
  <stop offset="50%" stopColor="currentColor" stopOpacity="0.12" />
  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
</radialGradient>

<radialGradient id="sectorPulse" cx="50%" cy="50%" r="70%">
  <stop offset="0%" stopColor="currentColor" stopOpacity="0.14" />
  <stop offset="40%" stopColor="currentColor" stopOpacity="0.06" />
  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
</radialGradient>



      </defs>

      <rect
        width="100%"
        height="100%"
        fill="url(#stars-dark)"
        className={styles.chartStars}
      />

      <g
        className={
          activeHighlight === category
            ? styles.highlighted
            : activeHighlight
            ? styles.dimmed
            : ""
        }
      ></g>

<symbol id="sectorHighlight" viewBox="0 0 200 173.2">
  <path
    d="M100 0 L200 57.7 L200 115.4 L100 173.2 L0 115.4 L0 57.7 Z"
    fill="currentColor"
    opacity="0.12"
  />
</symbol>

      {/* ===== GALACTIC SECTOR GRID (DARK THEME ONLY) ===== */}
<rect
  width="100%"
  height="100%"
  fill="url(#hexGrid)"
  className={styles.hexGrid}
/>

<rect
  width="100%"
  height="100%"
  fill="url(#hexGridSmall)"
  className={styles.hexGridSmall}
/>

{/* ===== HYPERLANE ROUTES ===== */}
<g className={styles.hyperlanes}>

  {/* Core trunk routes */}
  <path
    id="routeA"
    d="M180 780 Q420 620 760 540 T1220 320"
    className={styles.route}
  />

  <path
    id="routeB"
    d="M240 300 Q520 420 860 460 T1180 740"
    className={styles.route}
  />

  {/* Cross-sector link */}
  <path
    id="routeC"
    d="M360 220 Q640 380 920 260"
    className={styles.route}
  />

  {/* Animated travelers */}
  <g className={styles.laneTraffic}>
    <use href="#laneDot">
      <animateMotion dur="12s" repeatCount="indefinite">
        <mpath href="#routeA" />
      </animateMotion>
    </use>

    <use href="#laneDot">
      <animateMotion dur="9s" repeatCount="indefinite" begin="1.5s">
        <mpath href="#routeB" />
      </animateMotion>
    </use>

    <use href="#laneDot">
      <animateMotion dur="14s" repeatCount="indefinite" begin="3s">
        <mpath href="#routeC" />
      </animateMotion>
    </use>
  </g>
</g>


      <g className={styles.planets}>
        <g className={styles.planetLarge}>
          <circle cx="1220" cy="860" r="420" fill="url(#planetDark)" />
        </g>

        <g className={styles.planetSmall}>
          <circle cx="260" cy="200" r="120" fill="url(#planetDark)" />
        </g>
      </g>

      {/* ===== RADAR SWEEP ===== */}
<g className={styles.radarSystem}>
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

{/* ===== ACTIVE SECTOR REGIONS ===== */}
<g className={styles.activeSectors}>
  <g className={styles[`sector-${category ?? "people"}`]}>
    <circle cx="520" cy="340" r="260" fill="url(#sectorField)" />
    <circle cx="960" cy="520" r="320" fill="url(#sectorPulse)" />
    <circle cx="420" cy="720" r="220" fill="url(#sectorPulse)" />
  </g>
</g>



      <g className={styles.constellation}>
        <use href={`#${constellationId}`} />
      </g>
    </svg>
  );
}