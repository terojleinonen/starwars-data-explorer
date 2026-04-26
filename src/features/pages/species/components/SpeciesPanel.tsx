"use client";

import Link from "next/link";
import styles from "../styles/SpeciesPanel.module.css";

type Species = {
  name: string;
  classification: string;
  designation: string;
  average_height: string;
  average_lifespan: string;
  language: string;
  url: string;
};

function extractId(url: string) {
  return url.match(/\/(\d+)\/?$/)?.[1] ?? "";
}

function display(value: string) {
  return !value || value === "unknown" || value === "n/a"
    ? "Unknown"
    : value;
}

export default function SpeciesPanel({
  species,
}: {
  species: Species;
}) {
  return (
    <div className={styles.panel}>
      {/* HEADER */}
      <div className={styles.header}>
        <p className={styles.eyebrow}>Biological Record</p>
        <h2>{species.name}</h2>
      </div>

      {/* TAXONOMY GROUP */}
      <section className={styles.group}>
        <h4 className={styles.groupTitle}>Classification</h4>

        <div className={styles.grid}>
          <div className={styles.item}>
            <span>Class</span>
            <strong>{display(species.classification)}</strong>
          </div>

          <div className={styles.item}>
            <span>Designation</span>
            <strong>{display(species.designation)}</strong>
          </div>

          <div className={styles.item}>
            <span>Language</span>
            <strong>{display(species.language)}</strong>
          </div>
        </div>
      </section>

      {/* BIO METRICS */}
      <section className={styles.group}>
        <h4 className={styles.groupTitle}>Biological Metrics</h4>

        <div className={styles.grid}>
          <div className={styles.item}>
            <span>Average Height</span>
            <strong>{display(species.average_height)}</strong>
          </div>

          <div className={styles.item}>
            <span>Lifespan</span>
            <strong>{display(species.average_lifespan)}</strong>
          </div>
        </div>
      </section>

      {/* CTA */}
      <Link
        href={`/species/${extractId(species.url)}`}
        className={styles.cta}
      >
        Open Full Record
      </Link>
    </div>
  );
}