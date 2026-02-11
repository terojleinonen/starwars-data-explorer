import styles from "./TargetLock.module.css";

export default function TargetLock() {
  return (
    <div className={styles.lock}>
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="22" className={styles.reticle} />
        <circle cx="50" cy="50" r="8" className={styles.dot} />
      </svg>
    </div>
  );
}