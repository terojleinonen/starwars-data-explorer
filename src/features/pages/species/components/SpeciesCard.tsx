"use client";

import styles from "../styles/SpeciesCard.module.css";

type Species = {
  name: string;
  classification: string;
  designation: string;
  average_height: string;
  average_lifespan: string;
  language: string;
};

function display(value: string) {
  return !value || value === "unknown" || value === "n/a"
    ? "Unknown"
    : value;
}

export default function SpeciesCard({
  species,
  active,
  onClick,
}: {
  species: Species;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.card} ${active ? styles.active : ""}`}
      onClick={onClick}
    >
      {/* ORGANIC VISUAL */}
      <div className={styles.visual}>
        <div className={styles.bioAura} />
      </div>

      {/* CONTENT */}
      <div className={styles.content}>
        <h3>{species.name}</h3>

        <p>
          {display(species.classification)} •{" "}
          {display(species.designation)}
        </p>

        <span>{display(species.language)}</span>
      </div>
    </button>
  );
}