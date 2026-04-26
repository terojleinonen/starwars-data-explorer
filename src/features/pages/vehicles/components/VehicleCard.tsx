import styles from "../styles/VehicleCard.module.css";

type Vehicle = {
  name: string;
  model: string;
  vehicle_class: string;
  manufacturer: string;
  max_atmosphering_speed: string;
};

function displayValue(value: string) {
  return !value || value === "unknown" || value === "n/a" ? "Unknown" : value;
}

export default function VehicleCard({
  vehicle,
  active,
  onClick,
}: {
  vehicle: Vehicle;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.card} ${active ? styles.active : ""}`}
      onClick={onClick}
    >
      <div className={styles.visual}>
        <div className={styles.scanLine} />
      </div>

      <div className={styles.content}>
        <h3>{vehicle.name}</h3>
        <p>{displayValue(vehicle.vehicle_class)}</p>
        <span>{displayValue(vehicle.max_atmosphering_speed)}</span>
      </div>
    </button>
  );
}