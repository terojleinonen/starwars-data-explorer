import styles from "../styles/StarshipCard.module.css";

export default function StarshipCard({ ship, active, onClick }: any) {
  return (
    <button
      className={`${styles.card} ${active ? styles.active : ""}`}
      onClick={onClick}
    >
      <h3>{ship.name}</h3>
      <p>{ship.starship_class}</p>

      <div className={styles.metrics}>
        <span>HD: {ship.hyperdrive_rating}</span>
        <span>Crew: {ship.crew}</span>
      </div>
    </button>
  );
}