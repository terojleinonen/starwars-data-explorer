import styles from "../styles/DetailsSkeleton.module.css";

export default function DetailsSkeleton() {
  return (
    <section
      className={styles.skeleton}
      aria-hidden="true"
    >
      <div className={styles.heading} />

      <ul className={styles.list}>
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i} className={styles.item}>
            <div className={styles.category} />
            <div className={styles.label} />
          </li>
        ))}
      </ul>
    </section>
  );
}