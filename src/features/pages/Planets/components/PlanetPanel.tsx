import Link from "next/link";
import styles from "../styles/PlanetPanel.module.css";

type Planet = {
  name: string;
  climate: string;
  terrain: string;
  population: string;
  gravity: string;
  diameter: string;
  url: string;
};

function extractId(url: string) {
  return url.match(/\/(\d+)\/?$/)?.[1] ?? "";
}

export default function PlanetPanel({ planet }: { planet: Planet }) {
  return (
    <div className={styles.panel}>
      <h2>{planet.name}</h2>

      <div className={styles.meta}>
        <div><span>Climate</span><strong>{planet.climate}</strong></div>
        <div><span>Terrain</span><strong>{planet.terrain}</strong></div>
        <div><span>Population</span><strong>{planet.population}</strong></div>
        <div><span>Gravity</span><strong>{planet.gravity}</strong></div>
      </div>

      <Link href={`/planets/${extractId(planet.url)}`} className={styles.cta}>
        Open Full Record
      </Link>
    </div>
  );
}