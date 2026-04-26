"use client";

import styles from "../styles/PlanetCard.module.css";
import surface from "@/styles/holoSurfaces.module.css";

type Props = {
  planet: any;
  active: boolean;
  onClick: () => void;
};

function getPlanetStyle(name: string) {
  const map: Record<string, string> = {
    Tatooine: "desert",
    Hoth: "ice",
    Mustafar: "lava",
    Endor: "forest",
    Naboo: "lush",
  };

  return map[name] || "default";
}

export default function PlanetCard({ planet, active, onClick }: Props) {
  const variant = getPlanetStyle(planet.name);

  return (
    <button
      onClick={onClick}
      className={`${surface.card} ${styles.card} ${
        active ? surface.cardActive : ""
      }`}
    >
      <div className={`${styles.planet} ${styles[variant]}`} />

      <div className={styles.content}>
        <h4>{planet.name}</h4>
        <span>{planet.climate}</span>
      </div>
    </button>
  );
}