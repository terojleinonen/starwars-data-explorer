// FILE: PlanetHeader.tsx (TypeScript strict version)
// Fully typed, no implicit any, strict null checks, safer motion values.

import React, { MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  MotionValue,
} from "framer-motion";
import styles from "./PlanetHeader.module.css";

export type Theme = "light" | "dark";

export interface PlanetHeaderProps {
  theme: Theme;
  title: string;
  subtitle?: string;
  metrics?: Record<string, unknown> & {
    category?: string;
  };
}

interface GlassCardProps {
  theme: Theme;
  frontLabel: string;
  frontValue: string;
  backLabel: string;
  backValue: string;
  depth: number;
  xParallax: MotionValue<number>;
  yParallax: MotionValue<number>;
}

const GlassCard: React.FC<GlassCardProps> = ({
  theme,
  frontLabel,
  frontValue,
  backLabel,
  backValue,
  depth,
  xParallax,
  yParallax,
}) => {
  const isDark = theme === "dark";
  const scale = 1 - depth * 0.06;
  const offsetY = depth * 12;
  const opacity = 1 - depth * 0.22;

  const [flipped, setFlipped] = React.useState<boolean>(false);

  return (
    <motion.div
      className={`${styles["glass-card"]} ${isDark ? styles["glass-dark"] : styles["glass-light"]}`}
      style={{ x: xParallax, y: yParallax, scale, opacity, rotateY: flipped ? 180 : 0 }}
      initial={{ y: offsetY, opacity }}
      animate={{ y: offsetY, opacity, rotateY: flipped ? 180 : 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div className={styles["glass-card-front"]}>
        <div className={styles["label-small"]}>{frontLabel}</div>
        <div className={styles["value-small"]}>{frontValue}</div>
      </div>

      <div className={styles["glass-card-back"]}>
        <div className={styles["label-small"]}>{backLabel}</div>
        <div className={styles["value-small"]}>{backValue}</div>
      </div>
    </motion.div>
  );
};

// SAFELY type all SWAPI fields as strings
const safeValue = (v: unknown): string => {
  if (v === undefined || v === null) return "—";
  return typeof v === "string" || typeof v === "number" ? String(v) : "—";
};

interface SummaryField {
  frontLabel: string;
  frontValue: string;
  backLabel: string;
  backValue: string;
}

const pickSummaryFields = (category: string | undefined, metrics: Record<string, unknown> = {}): SummaryField[] => {
  const sw = (key: string) => safeValue(metrics[key]);

  const categories: Record<string, [string, string][]> = {
    planets: [
      ["GRAVITY", sw("gravity")],
      ["CLIMATE", sw("climate")],
      ["ORBITAL", sw("orbital_period")],
    ],
    people: [
      ["HEIGHT", sw("height")],
      ["MASS", sw("mass")],
      ["GENDER", sw("gender")],
    ],
    starships: [
      ["MODEL", sw("model")],
      ["HYPERDRIVE", sw("hyperdrive_rating")],
      ["CREW", sw("crew")],
    ],
    vehicles: [
      ["MODEL", sw("model")],
      ["SPEED", sw("max_atmosphering_speed")],
      ["CREW", sw("crew")],
    ],
    species: [
      ["CLASS", sw("classification")],
      ["LANGUAGE", sw("language")],
      ["LIFESPAN", sw("average_lifespan")],
    ],
    films: [
      ["DIRECTOR", sw("director")],
      ["RELEASE", sw("release_date")],
      ["EPISODE", sw("episode_id")],
    ],
  };

  const chosen = categories[category ?? ""] ?? [
    ["FIELD 1", "—"],
    ["FIELD 2", "—"],
    ["FIELD 3", "—"],
  ];

  return chosen.slice(0, 3).map(([label, value]) => ({
    frontLabel: label,
    frontValue: value,
    backLabel: "MORE",
    backValue: value,
  }));
};

const PlanetHeader: React.FC<PlanetHeaderProps> = ({ theme, title, subtitle, metrics }) => {
  const isDark = theme === "dark";

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-50, 50], [6, -6]);
  const rotateY = useTransform(x, [-50, 50], [-6, 6]);

  const bgX = useTransform(x, [-50, 50], [-3, 3]);
  const bgY = useTransform(y, [-50, 50], [-3, 3]);
  const planetX = useTransform(x, [-50, 50], [-2, 2]);
  const planetY = useTransform(y, [-50, 50], [-2, 2]);
  const glowX = useTransform(x, [-50, 50], [-1, 1]);
  const glowY = useTransform(y, [-50, 50], [-1, 1]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const summary = pickSummaryFields(metrics?.category, metrics ?? {});

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      style={{ perspective: "1400px", rotateX, rotateY }}
      className={`${styles["planet-header-container"]} ${isDark ? styles["glass-dark"] : styles["glass-light"]}`}
    >
      <motion.div style={{ x: bgX, y: bgY }} className={styles["planet-backlight"]} />

      <motion.div style={{ x: planetX, y: planetY }} className={styles["planet-sphere"]}>
        <div className={styles["planet-sphere-base"]} />
        <div className={styles["planet-sphere-overlay"]} />
      </motion.div>

      <motion.div style={{ x: glowX, y: glowY }} className={styles["planet-glow"]}>
        <div className={styles["planet-glow-inner"]} />
      </motion.div>

      <div className={styles["planet-header-text"]}>
        <div className="text-[0.65rem] uppercase tracking-[0.4em] text-sky-300/80">
          Starship OS · Planetary Data
        </div>
        <h1 className={`${styles["planet-header-title"]} text-2xl sm:text-3xl md:text-4xl`}>{title}</h1>
        {subtitle && <p className="text-xs sm:text-sm opacity-80 max-w-md">{subtitle}</p>}
      </div>

      <div className={`${styles["summary-stack-container"]} hidden sm:block`}>
        <GlassCard
          theme={theme}
          depth={2}
          {...summary[2]}
          xParallax={bgX}
          yParallax={bgY}
        />

        <div style={{ position: "absolute", top: "12px", left: "12px" }}>
          <GlassCard
            theme={theme}
            depth={1}
            {...summary[1]}
            xParallax={planetX}
            yParallax={planetY}
          />
        </div>

        <div style={{ position: "absolute", top: "24px", left: "24px" }}>
          <GlassCard
            theme={theme}
            depth={0}
            {...summary[0]}
            xParallax={glowX}
            yParallax={glowY}
          />
        </div>
      </div>
    </motion.div>
  );
};
export default PlanetHeader;