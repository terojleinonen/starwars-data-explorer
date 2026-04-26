import styles from "../styles/PeopleCard.module.css";
import surface from "@/styles/holoSurfaces.module.css";

type Person = {
  name: string;
  gender: string;
  birth_year: string;
};

export default function PeopleCard({
  person,
  active,
  onClick,
}: {
  person: Person;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`${styles.card} ${active ? styles.active : ""}`}
      onClick={onClick}
    >
      <div className={styles.avatar} />

      <div className={styles.content}>
        <h3>{person.name}</h3>
        <p>{person.gender}</p>
        <span>{person.birth_year}</span>
      </div>
    </button>
  );
}