"use client";

import { useEffect, useRef, useState } from "react";
import type { SwapiType } from "@/components/types/swapi-types";
import styles from "./CartographyBackground.module.css";

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

/* ======================================================
   HELPERS
====================================================== */

function angleBetween(x1: number, y1: number, x2: number, y2: number) {
  return Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
}

function distance(x1: number, y1: number, x2: number, y2: number) {
  return Math.hypot(x2 - x1, y2 - y1);
}

function randomPosition(): [number, number] {
  return [Math.random() * 1440, Math.random() * 1024];
}

export default function CartographySvgDark({ category, device }: Props) {

  const rootRef = useRef<SVGSVGElement>(null);
  const largePlanetRef = useRef<SVGGElement>(null);
  const smallPlanetRef = useRef<SVGGElement>(null);

  const [novaPos, setNovaPos] = useState<[number, number] | null>(null);
  const [novaPulse, setNovaPulse] = useState(0);
  const [stars, setStars] = useState<React.ReactNode[]>([]);

  const markers = MARKER_LAYOUTS[device][category ?? "people"] ?? [];
  const constellationId = `cons-${category ?? "people"}`;

  /* ======================================================
     STARFIELD SYSTEM
  ====================================================== */

  useEffect(() => {
    let starLayers: React.ReactNode[] = [];
    if (device === "desktop") {
      starLayers = [
        genarateStars(150, 0.2),
        genarateStars(70, 0.4),
        genarateStars(30, 0.8),
      ].flat();
    } else if (device === "tablet") {
      starLayers = [genarateStars(100, 0.2), genarateStars(40, 0.4)].flat();
    } else {
      starLayers = [genarateStars(50, 0.3)].flat();
    }
    setStars(starLayers);
  }, [device]);

  /* ======================================================
     SUPERNOVA SYSTEM
  ====================================================== */

  useEffect(() => {
    if (device === "mobile") return;

    const scheduleNova = () => {
      setNovaPos(randomPosition());
      setNovaPulse(1);

      setTimeout(() => setNovaPulse(0), 1200);

      const next = 15000 + Math.random() * 10000; // Less frequent
      setTimeout(scheduleNova, next);
    };

    const timeoutId = setTimeout(scheduleNova, 5000);
    return () => clearTimeout(timeoutId);
  }, [device]);

  /* ======================================================
     REACTIVE LIGHTING
  ====================================================== */

  useEffect(() => {
    if (device === "mobile") return;

    const root = rootRef.current;
    const large = largePlanetRef.current;
    const small = smallPlanetRef.current;

    if (!root || !large || !small || !novaPos) return;

    const [nx, ny] = novaPos;

    const lp = [1220, 860];
    const sp = [260, 200];

    const largeAngle = angleBetween(lp[0], lp[1], nx, ny);
    const smallAngle = angleBetween(sp[0], sp[1], nx, ny);

    const dLarge = distance(lp[0], lp[1], nx, ny);
    const dSmall = distance(sp[0], sp[1], nx, ny);

    const influenceLarge = Math.max(0, 1 - dLarge / 1200);
    const influenceSmall = Math.max(0, 1 - dSmall / 900);

    root.style.setProperty("--nova-pulse", String(novaPulse));
    root.style.setProperty("--nova-large-angle", `${largeAngle}deg`);
    root.style.setProperty("--nova-small-angle", `${smallAngle}deg`);
    root.style.setProperty("--nova-large-influence", String(influenceLarge));
    root.style.setProperty("--nova-small-influence", String(influenceSmall));
  }, [novaPos, novaPulse, device]);

  /* ======================================================
     SHOOTING STARS
  ====================================================== */

  const [shooters, setShooters] = useState<number[]>([]);
  const [shootingStars, setShootingStars] = useState<React.ReactNode[]>([]);
  const [satelliteFlybys, setSatelliteFlybys] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const numShootingStars =
      device === "desktop" ? 5 : device === "tablet" ? 2 : 0;
    const newShootingStars = [];
    for (let i = 0; i < numShootingStars; i++) {
      newShootingStars.push(
        <line
          key={`shooter-${i}`}
          x1="0"
          y1={Math.random() * 1024}
          x2="1440"
          y2={Math.random() * 1024}
          className={styles.shootingStar}
          style={{ animationDelay: `${Math.random() * 10}s` }}
        />
      );
    }
    setShootingStars(newShootingStars);

    const numSatellites = device === "desktop" ? 3 : device === "tablet" ? 1 : 0;
    const newSatellites = [];
    for (let i = 0; i < numSatellites; i++) {
      newSatellites.push(
        <circle
          key={`satellite-${i}`}
          cx="0"
          cy={200 + Math.random() * 600}
          r="2"
          className={styles.satellite}
          style={{ animationDelay: `${Math.random() * 20}s` }}
        />
      );
    }
    setSatelliteFlybys(newSatellites);
  }, [device]);

  /* ======================================================
     SATELLITE FLYBYS
  ====================================================== */

  const [satellites, setSatellites] = useState<number[]>([]);

  function genarateStars(count: number, opacity: number) {
    const stars = [];

    for (let i = 0; i < count; i++) {
      const y = Math.random() * 1024;
      const x = Math.random() * 1440;
      const size = Math.random() * 1.4 + 0.3;

      stars.push(
        <use
          key={`star-${i}-${opacity}`}
          href="#star"
          x={x}
          y={y}
          width={size}
          height={size}
          opacity={opacity * (Math.random() * 0.5 + 0.5)}
        />
      );
    }

    return stars;
  }


  return (
    <svg
      ref={rootRef}
      viewBox="0 0 1440 1024"
      preserveAspectRatio="xMidYMid slice"
      className={styles.svg}
    >
      <defs>
        {/* Hard cinematic black base */}
        <rect width="100%" height="100%" fill="#020409"/>

        <symbol id="star" viewBox="0 0 2 2">
          <circle cx="1" cy="1" r="1" fill="white" />
        </symbol>

        {/* Planet rim */}
        <radialGradient id="planetRimStrong" cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="88%" stopColor="var(--category-accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--category-accent)" stopOpacity="0.85" />
        </radialGradient>

        {/* Shadow */}
        <linearGradient id="shadowSide" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="black" stopOpacity="0.6" />
          <stop offset="100%" stopColor="black" stopOpacity="0" />
        </linearGradient>

        {/* Specular */}
        <radialGradient id="specularSpot" cx="30%" cy="30%" r="40%">
          <stop offset="0%" stopColor="white" stopOpacity="0.65" />
          <stop offset="40%" stopColor="white" stopOpacity="0.25" />
          <stop offset="80%" stopColor="white" stopOpacity="0.05" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>

        {/* Supernova */}
        <radialGradient id="novaGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="white" stopOpacity="0.8" />
          <stop offset="40%" stopColor="white" stopOpacity="0.35" />
          <stop offset="80%" stopColor="white" stopOpacity="0.05" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g className={styles.stars}>
        {stars}
      </g>


      {/* Planets */}
      <g className={styles.planets}>
        <g className={styles.planetLarge} ref={largePlanetRef}>
          <circle cx="1220" cy="860" r="420" fill="url(#planetRimStrong)" />
          <circle cx="1220" cy="860" r="420" fill="url(#shadowSide)" className={styles.planetShadow} />
          <circle cx="1220" cy="860" r="420" fill="url(#specularSpot)" className={styles.planetSpecular} />
        </g>

        <g className={styles.planetSmall} ref={smallPlanetRef}>
          <circle cx="260" cy="200" r="120" fill="url(#planetRimStrong)" />
          <circle cx="260" cy="200" r="120" fill="url(#shadowSide)" className={styles.planetShadow} />
          <circle cx="260" cy="200" r="120" fill="url(#specularSpot)" className={styles.planetSpecular} />
        </g>
      </g>

      {/* Supernova */}
      {novaPos && (
        <circle
          cx={novaPos[0]}
          cy={novaPos[1]}
          r="420"
          fill="url(#novaGlow)"
          className={styles.supernova}
          style={{ opacity: novaPulse }}
        />
      )}

      {/* Shooting stars */}
      {shootingStars}

      {/* Satellites */}
      {satelliteFlybys}


      {/* Sector markers */}
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
            <circle r="4" fill="currentColor" />
          </g>
        ))}
      </g>

      {/* Constellations */}
      <g className={styles.constellation}>
        <use href={`#${constellationId}`} />
      </g>
    </svg>
  );
}