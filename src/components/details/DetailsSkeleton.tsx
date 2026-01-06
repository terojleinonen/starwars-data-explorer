import styles from "./RelatedRailSkeleton.module.css";

export default function RelatedRailSkeleton() {
  return (
    <section
      className={styles.rail}
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