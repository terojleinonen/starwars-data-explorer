import Link from "next/link";
import styles from "../styles/VehiclePanel.module.css";

type Vehicle = {
  name: string;
  model: string;
  manufacturer: string;
  vehicle_class: string;
  crew: string;
  passengers: string;
  max_atmosphering_speed: string;
  cargo_capacity?: string;
  url: string;
};

function extractId(url: string): string {
  return url.match(/\/(\d+)\/?$/)?.[1] ?? "";
}

function displayValue(value: string | undefined): string {
  return !value || value === "unknown" || value === "n/a" ? "Unknown" : value;
}

export default function VehiclePanel({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Selected Vehicle</p>
        <h2>{vehicle.name}</h2>
      </div>

      <div className={styles.meta}>
        <div>
          <span>Model</span>
          <strong>{displayValue(vehicle.model)}</strong>
        </div>

        <div>
          <span>Class</span>
          <strong>{displayValue(vehicle.vehicle_class)}</strong>
        </div>

        <div>
          <span>Manufacturer</span>
          <strong>{displayValue(vehicle.manufacturer)}</strong>
        </div>

        <div>
          <span>Speed</span>
          <strong>{displayValue(vehicle.max_atmosphering_speed)}</strong>
        </div>

        <div>
          <span>Crew</span>
          <strong>{displayValue(vehicle.crew)}</strong>
        </div>

        <div>
          <span>Passengers</span>
          <strong>{displayValue(vehicle.passengers)}</strong>
        </div>
      </div>

      <Link
        href={`/vehicles/${extractId(vehicle.url)}`}
        className={styles.cta}
      >
        Open Full Record
      </Link>
    </div>
  );
}