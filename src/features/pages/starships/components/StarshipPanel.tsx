import Link from "next/link";
import styles from "../styles/StarshipPanel.module.css";

const toNumber = (v: string) =>
  Number(v?.replace(/,/g, "")) || 0;

function extractId(url: string) {
  return url.match(/\/(\d+)\/?$/)?.[1] ?? "";
}

function Bar({ label, value, max = 100000 }: any) {
  const pct = Math.min((value / max) * 100, 100);

  return (
    <div className={styles.barRow}>
      <span>{label}</span>
      <div className={styles.bar}>
        <div style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function StarshipPanel({ ship }: any) {
  return (
    <div className={styles.panel}>
      <h2>{ship.name}</h2>

      <div className={styles.meta}>
        <div>
          <span>Model</span>
          <strong>{ship.model}</strong>
        </div>

        <div>
          <span>Manufacturer</span>
          <strong>{ship.manufacturer}</strong>
        </div>
      </div>

      <div className={styles.specs}>
        <Bar
          label="Cargo"
          value={toNumber(ship.cargo_capacity)}
          max={100000}
        />
        <Bar
          label="Crew"
          value={toNumber(ship.crew)}
          max={100}
        />
        <Bar
          label="Passengers"
          value={toNumber(ship.passengers)}
          max={500}
        />
      </div>
      <Link
        href={`/starships/${extractId(ship.url)}`}
        className={styles.cta}
      >
        Open Full Record
      </Link>
    </div>
  );
}