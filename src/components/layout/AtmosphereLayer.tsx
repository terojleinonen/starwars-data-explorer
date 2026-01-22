"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { SwapiType } from "@/components/types/swapi-types";
import styles from "./AtmosphereLayer.module.css";

type Props = {
  category?: SwapiType;
};

export default function AtmosphereLayer({ category }: Props) {
  const pathname = usePathname();

  /* --------------------------------------------
     Crossfade state
  -------------------------------------------- */
  const prevCategoryRef = useRef<SwapiType | undefined>(category);
  const [prevCategory, setPrevCategory] = useState<SwapiType | undefined>();
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
  const next = category;

  if (!prevCategoryRef.current) {
    prevCategoryRef.current = next;
    return;
  }

  if (prevCategoryRef.current === next) return;

  setPrevCategory(prevCategoryRef.current);
  setTransitioning(true);

  // 🔗 SYSTEM SYNC
  document.documentElement.style.setProperty(
    "--atmosphere-strength",
    "0.28"
  );

  prevCategoryRef.current = next;

  const t = window.setTimeout(() => {
    setTransitioning(false);
    setPrevCategory(undefined);

    // return to idle glow
    document.documentElement.style.setProperty(
      "--atmosphere-strength",
      "0.18"
    );
  }, 650);

  return () => window.clearTimeout(t);
}, [pathname, category]);


  /* --------------------------------------------
     Cinematic micro-parallax (CSS vars)
  -------------------------------------------- */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const root = document.documentElement;

    function onMove(e: PointerEvent) {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;

      targetX = (e.clientX - cx) / cx;
      targetY = (e.clientY - cy) / cy;
    }

    function tick() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      root.style.setProperty("--px", currentX.toFixed(3));
      root.style.setProperty("--py", currentY.toFixed(3));

      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className={styles.root} aria-hidden="true">
      {transitioning && prevCategory && (
        <div
          className={`${styles.layer} ${styles.outgoing}`}
          data-category={prevCategory}
          style={{ color: "var(--category-accent)" }}
        >
          <OptimizedCartographySVG className={styles.svg} />
        </div>
      )}

      <div
        className={`${styles.layer} ${
          transitioning ? styles.incoming : styles.steady
        }`}
        data-category={category}
        style={{ color: "var(--category-accent)" }}
      >
        <OptimizedCartographySVG className={styles.svg} />
      </div>
    </div>
  );
}

function OptimizedCartographySVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 1024"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Base sparse star field (static) */}
        <pattern id="starsBase" width="160" height="160" patternUnits="userSpaceOnUse">
          <circle cx="24" cy="32" r="1" />
          <circle cx="112" cy="48" r="0.8" />
          <circle cx="72" cy="118" r="0.6" />
        </pattern>

        {/* Twinkle stars (different distribution + slightly larger points) */}
        <pattern id="starsTwinkle" width="220" height="220" patternUnits="userSpaceOnUse">
          <circle cx="36" cy="44" r="1.4" />
          <circle cx="180" cy="72" r="1.1" />
          <circle cx="120" cy="188" r="1.2" />
          <circle cx="70" cy="160" r="0.9" />
        </pattern>

        <radialGradient id="planet-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="60%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="80%" stopColor="currentColor" stopOpacity="0.08" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="fade-mask" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="70%" stopColor="white" stopOpacity="0.7" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>

        <mask id="vertical-fade">
          <rect width="100%" height="100%" fill="url(#fade-mask)" />
        </mask>
      </defs>

      {/* Stars (static) */}
      <g className="stars">
        <rect width="100%" height="100%" fill="url(#starsBase)" opacity="0.42" />
      </g>

      {/* Stars (twinkle layer - opacity animated in CSS) */}
      <g className="starsTwinkle">
        <rect width="100%" height="100%" fill="url(#starsTwinkle)" opacity="0.22" />
      </g>

      {/* Orbital arcs */}
      <g
        className="orbits"
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

      {/* Planets */}
      <g className="planet planetPrimary" mask="url(#vertical-fade)">
        <circle cx="720" cy="1100" r="620" fill="url(#planet-gradient)" />
      </g>

      <g className="planet planetSecondary">
        <circle cx="1180" cy="220" r="260" fill="url(#planet-gradient)" opacity="0.6" />
      </g>
    </svg>
  );
}