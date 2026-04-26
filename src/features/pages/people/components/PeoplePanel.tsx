import Link from "next/link";
import styles from "../styles/PeoplePanel.module.css";

type Person = {
  name: string;
  gender: string;
  birth_year: string;
  height: string;
  mass: string;
  url: string;
};

function extractId(url: string) {
  return url.match(/\/(\d+)\/?$/)?.[1] ?? "";
}

export default function PeoplePanel({ person }: { person: Person }) {
  return (
    <div className={styles.panel}>
      <h2>{person.name}</h2>

      <div className={styles.metaGrid}>
        <div>
          <span>Gender</span>
          <strong>{person.gender}</strong>
        </div>
        <div>
          <span>Birth</span>
          <strong>{person.birth_year}</strong>
        </div>
        <div>
          <span>Height</span>
          <strong>{person.height}</strong>
        </div>
        <div>
          <span>Mass</span>
          <strong>{person.mass}</strong>
        </div>
      </div>

      <Link
        href={`/people/${extractId(person.url)}`}
        className={styles.cta}
      >
        Open Full Record
      </Link>
    </div>
  );
}