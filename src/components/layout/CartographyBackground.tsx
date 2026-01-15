"use client";

import styles from "./CartographyBackground.module.css";

export default function CartographyBackground() {
  return (
    <div className={styles.cartography} aria-hidden="true">
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className={styles.svg}
      >
        <defs>
          {/* Planet gradient */}
          <radialGradient
            id="planetGlow"
            cx="35%"
            cy="35%"
            r="65%"
          >
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop
              offset="60%"
              stopColor="var(--category-accent)"
              stopOpacity="0.55"
            />
            <stop
              offset="100%"
              stopColor="var(--category-accent)"
              stopOpacity="0.15"
            />
          </radialGradient>
        </defs>

        {/* ================= ORBITS ================= */}
        <g className={styles.orbits}>
          <ellipse cx="420" cy="420" rx="320" ry="190" />
          <ellipse cx="820" cy="360" rx="420" ry="260" className={styles.orbitSoft} />
          <ellipse cx="1020" cy="520" rx="380" ry="240" />
          <ellipse cx="720" cy="620" rx="520" ry="300" className={styles.orbitSoft} />
        </g>

        {/* ================= PLANETS ================= */}
        <g className={styles.planets}>
          <circle cx="1150" cy="760" r="180" fill="url(#planetGlow)" />
          <circle cx="260" cy="240" r="90" fill="url(#planetGlow)" />
          <circle cx="980" cy="180" r="46" fill="url(#planetGlow)" />
        </g>

        {/* ================= STARS ================= */}
        <g className={styles.stars}>
          <circle cx="120" cy="120" r="1.4" />
          <circle cx="240" cy="640" r="1.1" />
          <circle cx="380" cy="180" r="0.9" />
          <circle cx="520" cy="720" r="1.6" />
          <circle cx="660" cy="460" r="1.2" />
          <circle cx="740" cy="120" r="1.0" />
          <circle cx="860" cy="300" r="1.3" />
          <circle cx="980" cy="540" r="1.1" />
          <circle cx="1120" cy="260" r="1.5" />
          <circle cx="1320" cy="460" r="1.2" />
        </g>
      </svg>
    </div>
  );
}