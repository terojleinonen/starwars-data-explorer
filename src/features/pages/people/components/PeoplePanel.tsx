import Link from "next/link";
import styles from "../styles/PeoplePanel.module.css";
import { Person } from "@/types/swapi";

function extractId(url: string) {
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

export default function PeoplePanel({
  person,
}: {
  person: Person;
}) {
  return (
    <div className={styles.panel}>
      {/* HERO */}

      <div className={styles.hero}>
        <div className={styles.avatar}>
          {person.name.charAt(0)}
        </div>

        <p className={styles.eyebrow}>
          Personnel Dossier
        </p>

        <h2 className={styles.title}>
          {person.name}
        </h2>

        <p className={styles.subtitle}>
          {displayValue(person.gender)}
        </p>
      </div>

      {/* METRICS */}

      <div className={styles.metrics}>
        <div className={styles.metricCard}>
          <span>Birth</span>

          <strong>
            {displayValue(
              person.birth_year
            )}
          </strong>
        </div>

        <div className={styles.metricCard}>
          <span>Height</span>

          <strong>
            {displayValue(
              person.height
            )}
          </strong>
        </div>

        <div className={styles.metricCard}>
          <span>Mass</span>

          <strong>
            {displayValue(
              person.mass
            )}
          </strong>
        </div>
      </div>

      {/* PROFILE */}

      <div className={styles.profile}>
        <div className={styles.spec}>
          <span>Gender</span>

          <strong>
            {displayValue(
              person.gender
            )}
          </strong>
        </div>

        <div className={styles.spec}>
          <span>Birth Year</span>

          <strong>
            {displayValue(
              person.birth_year
            )}
          </strong>
        </div>
      </div>

      {/* CTA */}

      <Link
        href={`/people/${extractId(
          person.url
        )}`}
        className={styles.cta}
      >
        Open Full Record
      </Link>
    </div>
  );
}