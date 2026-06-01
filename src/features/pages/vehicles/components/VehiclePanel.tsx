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

function displayValue(
  value: string | undefined
): string {
  return !value ||
    value === "unknown" ||
    value === "n/a"
    ? "Unknown"
    : value;
}

export default function VehiclePanel({
  vehicle,
}: {
  vehicle: Vehicle;
}) {
  return (
    <div className={styles.panel}>
      {/* HERO */}

      <div className={styles.hero}>
        <div className={styles.glow} />

        <p className={styles.eyebrow}>
          Vehicle Dossier
        </p>

        <h2 className={styles.title}>
          {vehicle.name}
        </h2>

        <p className={styles.subtitle}>
          {displayValue(
            vehicle.vehicle_class
          )}
        </p>
      </div>

      {/* METRICS */}

      <div className={styles.metrics}>
        <div className={styles.metricCard}>
          <span>Speed</span>
          <strong>
            {displayValue(
              vehicle.max_atmosphering_speed
            )}
          </strong>
        </div>

        <div className={styles.metricCard}>
          <span>Crew</span>
          <strong>
            {displayValue(vehicle.crew)}
          </strong>
        </div>

        <div className={styles.metricCard}>
          <span>Passengers</span>
          <strong>
            {displayValue(
              vehicle.passengers
            )}
          </strong>
        </div>
      </div>

      {/* SPECIFICATIONS */}

      <div className={styles.specs}>
        <div className={styles.spec}>
          <span>Model</span>

          <strong>
            {displayValue(vehicle.model)}
          </strong>
        </div>

        <div className={styles.spec}>
          <span>Cargo Capacity</span>

          <strong>
            {displayValue(
              vehicle.cargo_capacity
            )}
          </strong>
        </div>
      </div>

      {/* MANUFACTURER */}

      <div className={styles.manufacturer}>
        <span>Manufacturer</span>

        <strong>
          {displayValue(
            vehicle.manufacturer
          )}
        </strong>
      </div>

      {/* CTA */}

      <Link
        href={`/vehicles/${extractId(
          vehicle.url
        )}`}
        className={styles.cta}
      >
        Open Full Record
      </Link>
    </div>
  );
}