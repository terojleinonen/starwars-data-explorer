"use client";

import { useEffect, useRef } from "react";
import type { SwapiType } from "@/components/types/swapi-types";
import styles from "./CartographyBackground.module.css";

type Props = {
  category?: SwapiType;
  pulse?: boolean;
};

export default function CartographyBackground({ category, pulse }: Props) {
  const starsRef = useRef<SVGGElement | null>(null);
  const constellationId = `cons-${category}`;

  useEffect(() => {
    const el = starsRef.current;
    if (!el) return;

    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const h = Math.max(1, window.innerHeight);
        const t = Math.min(1, y / (h * 1.1));

        // base opacity + subtle scroll-linked boost
        const opacity = 0.25 + t * 0.18;

        // microscopic scale shift for "twinkle"
        const scale = 1 + t * 0.015;

        el.style.opacity = String(opacity);
        el.style.transform = `scale(${scale})`;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className={styles.cartography}
      data-category={category}
      data-pulse={pulse || undefined}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 1024"
        preserveAspectRatio="xMidYMid slice"
        className={styles.svg}
      >
        <defs>
          {/* ================= STAR FIELD ================= */}

          <pattern
            id="starfield"
            width="140"
            height="140"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="18" cy="24" r="0.9" />
            <circle cx="92" cy="36" r="0.6" />
            <circle cx="64" cy="96" r="0.7" />
            <circle cx="120" cy="112" r="0.5" />
          </pattern>

          {/* ================= PLANET RIM ================= */}

          <radialGradient id="planet-rim" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="85%" stopColor="currentColor" stopOpacity="0.45" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.85" />
          </radialGradient>

          {/* ================= CONSTELLATIONS ================= */}

          {/* PEOPLE */}
          <symbol id="cons-people" viewBox="0 0 1440 1024">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.55"
            >
              <path d="M260 560 L360 520 L460 560 L560 510 L660 540" />
              <path d="M460 560 L470 690 L580 740" />
              <path d="M560 510 L600 420 L700 380 L800 420" />

              <g fill="currentColor" stroke="none">
                <circle cx="460" cy="560" r="2.6" data-anchor />
                <circle cx="360" cy="520" r="1.6" />
                <circle cx="560" cy="510" r="1.8" />
                <circle cx="660" cy="540" r="1.6" />
                <circle cx="580" cy="740" r="1.5" />
              </g>
            </g>
          </symbol>

          {/* PLANETS */}
          <symbol id="cons-planets" viewBox="0 0 1440 1024">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.55"
            >
              <ellipse cx="1040" cy="360" rx="260" ry="100" opacity="0.35" />
              <ellipse cx="1040" cy="360" rx="360" ry="140" opacity="0.18" />

              <g fill="currentColor" stroke="none">
                <circle cx="1040" cy="360" r="3" data-anchor />
                <circle cx="860" cy="360" r="1.6" />
                <circle cx="1220" cy="360" r="1.6" />
              </g>
            </g>
          </symbol>

          {/* FILMS */}
          <symbol id="cons-films" viewBox="0 0 1440 1024">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.55"
            >
              <path d="M320 240 L520 240 L720 240 L920 240 L1120 240" />
              <g fill="currentColor" stroke="none">
                <circle cx="720" cy="240" r="2.6" data-anchor />
                <circle cx="520" cy="240" r="1.6" />
                <circle cx="920" cy="240" r="1.6" />
              </g>
            </g>
          </symbol>

          {/* STARSHIPS */}
          <symbol id="cons-starships" viewBox="0 0 1440 1024">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.55"
            >
              <path d="M280 720 L580 560 L880 430 L1180 300" />
              <g fill="currentColor" stroke="none">
                <circle cx="880" cy="430" r="2.8" data-anchor />
                <circle cx="580" cy="560" r="1.8" />
                <circle cx="1180" cy="300" r="1.8" />
              </g>
            </g>
          </symbol>

          {/* VEHICLES */}
          <symbol id="cons-vehicles" viewBox="0 0 1440 1024">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.55"
            >
              <path d="M260 860 L460 820 L660 860 L860 820 L1060 860" />
              <g fill="currentColor" stroke="none">
                <circle cx="660" cy="860" r="2.6" data-anchor />
                <circle cx="460" cy="820" r="1.6" />
                <circle cx="860" cy="820" r="1.6" />
              </g>
            </g>
          </symbol>

          {/* SPECIES */}
          <symbol id="cons-species" viewBox="0 0 1440 1024">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.55"
            >
              <path d="M360 360 L420 330 L480 360 L440 420 Z" />
              <path d="M580 520 L650 480 L720 530 L660 590 Z" />
              <g fill="currentColor" stroke="none">
                <circle cx="480" cy="360" r="2.6" data-anchor />
                <circle cx="650" cy="480" r="1.6" />
              </g>
            </g>
          </symbol>

          {/* ================= PLANET SURFACES ================= */}
          <radialGradient id="rockySurface" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#d0d0d0" />
            <stop offset="60%" stopColor="#8a8a8a" />
            <stop offset="100%" stopColor="#3f3f3f" />
          </radialGradient>

          <pattern
            id="craters"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="18" cy="26" r="3" opacity="0.35" />
            <circle cx="52" cy="38" r="2" opacity="0.25" />
            <circle cx="34" cy="64" r="4" opacity="0.2" />
          </pattern>

          <linearGradient id="gasBands" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e5edf2" />
            <stop offset="25%" stopColor="#b7c9d4" />
            <stop offset="50%" stopColor="#9fb2bf" />
            <stop offset="75%" stopColor="#b7c9d4" />
            <stop offset="100%" stopColor="#e5edf2" />
          </linearGradient>

          <radialGradient id="cloudWorld" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#b6d6de" />
            <stop offset="55%" stopColor="#5b8a95" />
            <stop offset="100%" stopColor="#142428" />
          </radialGradient>

          {/* ================= CATEGORY RIM ================= */}
          <radialGradient id="rimGlow" cx="50%" cy="50%" r="52%">
            <stop offset="86%" stopColor="currentColor" stopOpacity="0.35" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ================= STARS (TWINKLE LAYER) ================= */}
        <g
          ref={starsRef}
          className={styles.stars}
          style={{
            transformOrigin: "50% 50%",
            transition: "opacity 400ms ease",
          }}
        >
          <rect width="100%" height="100%" fill="url(#stars)" />
        </g>

        {/* ================= ORBITAL ARCS ================= */}
        <g
          className={styles.orbits}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.18"
        >
          <path d="M -200 520 A 900 260 0 0 1 1640 520" />
          <path
            d="M -100 680 A 1100 380 0 0 0 1540 560"
            strokeDasharray="6 10"
            opacity="0.14"
          />
          <path
            d="M 180 300 A 700 200 0 0 1 1260 260"
            strokeWidth="0.8"
            opacity="0.22"
          />
        </g>

        {/* ================= SMALL ROCKY PLANET ================= */}
        <g transform="translate(1080 180)">
          <circle r="48" fill="url(#rockySurface)" />
          <circle r="48" fill="url(#craters)" />
        </g>

        {/* ================= MEDIUM GAS / ICE GIANT ================= */}
        <g transform="translate(320 280)">
          <circle r="110" fill="url(#gasBands)" />
          <circle r="118" fill="url(#rimGlow)" />
        </g>

        {/* ================= LARGE CLOUD WORLD ================= */}
        <g transform="translate(1560 940)">
          <circle r="520" fill="url(#cloudWorld)" />
          <circle r="540" fill="url(#rimGlow)" />
        </g>
        {/* ================= CONSTELLATION ================= */}
        {category && (
          <g className={styles.constellation}>
            <use href={`#${constellationId}`} />
          </g>
        )}  
      </svg>
    </div>
  );
}