"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  categoryFromPath,
  generateDust,
  generateStars,
  type ArchiveCategory,
} from "@/lib/background/generator";
import styles from "../styles/ArchiveBackground.module.css";

type Props = {
  category?: ArchiveCategory;
  intensity?: "quiet" | "standard" | "cinematic";
  animated?: boolean;
};

export default function ArchiveBackground({
  category,
  intensity = "standard",
  animated = true,
}: Props) {
  const pathname = usePathname();
  const activeCategory = category ?? categoryFromPath(pathname);
  const stars = useMemo(() => generateStars(activeCategory), [activeCategory]);
  const dust = useMemo(() => generateDust(activeCategory), [activeCategory]);

  return (
    <div
      className={styles.root}
      data-category={activeCategory}
      data-intensity={intensity}
      data-animated={animated ? "true" : "false"}
      aria-hidden="true"
    >
      <div className={styles.base} />
      <div className={styles.atmosphere} />
      <div className={styles.nebula} />

      <svg className={styles.sky} viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="archive-soft-star" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
          <filter id="archive-paper-noise" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="3" seed="17" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <g className={styles.starField}>
          {stars.map((star, index) => (
            <circle
              key={`${activeCategory}-star-${index}`}
              cx={star.x * 10}
              cy={star.y * 10}
              r={star.radius}
              opacity={star.opacity}
              className={star.radius > 1.25 ? styles.brightStar : undefined}
            />
          ))}
        </g>
        <CategoryGeometry category={activeCategory} />
        <rect className={styles.noiseRect} width="1000" height="1000" filter="url(#archive-paper-noise)" />
      </svg>

      <div className={styles.dust}>
        {dust.map((particle, index) => (
          <i
            key={`${activeCategory}-dust-${index}`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.radius}px`,
              height: `${particle.radius}px`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      <div className={styles.grain} />
      <div className={styles.vignette} />
    </div>
  );
}

function CategoryGeometry({ category }: { category: ArchiveCategory }) {
  if (category === "people") {
    return (
      <g className={styles.categoryGeometry}>
        <path d="M90 260 L270 190 L430 330 L650 205 L890 300" />
        <path d="M155 650 L360 530 L550 680 L795 535" />
        {["90,260", "270,190", "430,330", "650,205", "890,300", "155,650", "360,530", "550,680", "795,535"].map((point) => {
          const [cx, cy] = point.split(",");
          return <circle key={point} cx={cx} cy={cy} r="7" />;
        })}
      </g>
    );
  }

  if (category === "planets") {
    return (
      <g className={`${styles.categoryGeometry} ${styles.orbitGeometry}`}>
        <ellipse cx="360" cy="515" rx="330" ry="145" transform="rotate(-16 360 515)" />
        <ellipse cx="640" cy="420" rx="390" ry="205" transform="rotate(18 640 420)" />
        <circle cx="710" cy="365" r="82" />
        <path d="M628 365h164M710 283c-42 38-42 126 0 164M710 283c42 38 42 126 0 164" />
        <circle cx="173" cy="592" r="8" className={styles.geometryNode} />
      </g>
    );
  }

  if (category === "starships" || category === "vehicles") {
    return (
      <g className={`${styles.categoryGeometry} ${styles.blueprintGeometry}`}>
        <path d="M120 250H880M120 750H880M230 125V875M770 125V875" />
        <path d="M310 510L440 382H610L710 510L610 625H440Z" />
        <path d="M245 510H755M525 325V682" />
        <path d="M120 235v30M160 242v16M200 242v16M840 242v16M880 235v30" />
        <circle cx="525" cy="510" r="118" />
      </g>
    );
  }

  if (category === "species") {
    return (
      <g className={`${styles.categoryGeometry} ${styles.bioGeometry}`}>
        <path d="M180 850C325 720 335 605 255 505S210 260 410 130" />
        <path d="M820 150C670 280 665 395 745 500S790 745 590 870" />
        <path d="M295 655L705 345M255 505L745 500M325 345L675 655" />
        {["295,655", "705,345", "255,505", "745,500", "325,345", "675,655"].map((point) => {
          const [cx, cy] = point.split(",");
          return <circle key={point} cx={cx} cy={cy} r="10" />;
        })}
      </g>
    );
  }

  if (category === "films") {
    return (
      <g className={`${styles.categoryGeometry} ${styles.filmGeometry}`}>
        <path d="M105 145H895V855H105Z" />
        {Array.from({ length: 9 }, (_, index) => (
          <g key={index}>
            <rect x="122" y={178 + index * 70} width="26" height="40" rx="3" />
            <rect x="852" y={178 + index * 70} width="26" height="40" rx="3" />
          </g>
        ))}
        <path d="M500 240L790 765H210Z" />
      </g>
    );
  }

  return (
    <g className={`${styles.categoryGeometry} ${styles.homeGeometry}`}>
      <circle cx="500" cy="500" r="172" />
      <circle cx="500" cy="500" r="275" />
      <circle cx="500" cy="500" r="386" />
      <path d="M500 80V920M80 500H920M202 202L798 798M798 202L202 798" />
      <circle cx="500" cy="500" r="10" className={styles.geometryNode} />
    </g>
  );
}
