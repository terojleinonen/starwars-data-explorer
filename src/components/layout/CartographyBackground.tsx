"use client";

import styles from "./CartographyBackground.module.css";

/**
 * CartographyBackground
 * ---------------------
 * Decorative galactic star map + planetary bodies.
 * Paint-only. No layout, no events, no scroll ownership.
 */
export default function CartographyBackground() {
  return (
    <div className={styles.cartography} aria-hidden="true">
      <svg
        className={styles.svg}
        viewBox="0 0 1440 1024"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* ================= STARS ================= */}

          <pattern
            id="stars"
            width="140"
            height="140"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="12" cy="18" r="1" />
            <circle cx="90" cy="22" r="0.9" />
            <circle cx="58" cy="74" r="0.7" />
            <circle cx="120" cy="96" r="0.6" />
            <circle cx="34" cy="118" r="0.8" />
          </pattern>

          {/* ================= PLANET GLOW ================= */}

          <radialGradient id="planetGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
            <stop offset="55%" stopColor="currentColor" stopOpacity="0.18" />
            <stop offset="75%" stopColor="currentColor" stopOpacity="0.08" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>

          {/* ================= VERTICAL FADE ================= */}

          <linearGradient id="fadeMask" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="70%" stopColor="white" stopOpacity="0.75" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          <mask id="verticalFade">
            <rect width="100%" height="100%" fill="url(#fadeMask)" />
          </mask>
        </defs>

        {/* ================= STAR FIELD ================= */}

        <rect
          width="100%"
          height="100%"
          fill="url(#stars)"
          opacity="0.6"
        />

        {/* ================= ORBITAL CARTOGRAPHY ================= */}

        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.22"
        >
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

        {/* ================= PLANETARY BODIES ================= */}

        <g mask="url(#verticalFade)">
          {/* Large horizon planet */}
          <circle
            cx="720"
            cy="1350"
            r="460"
            fill="url(#planetGlow)"
          />

          {/* Medium planet */}
          <circle
            cx="1100"
            cy="320"
            r="180"
            fill="url(#planetGlow)"
          />

          {/* Small distant body */}
          <circle
            cx="260"
            cy="180"
            r="64"
            fill="url(#planetGlow)"
          />
        </g>
      </svg>
    </div>
  );
}