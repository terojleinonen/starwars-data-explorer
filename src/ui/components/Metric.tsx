import styles from "./primitives.module.css";

type Props = { label: string; value: string | number; hint?: string; featured?: boolean; className?: string };
export function Metric({ label, value, hint, featured = false, className = "" }: Props) {
  const safeValue = value == null || (typeof value === "number" && Number.isNaN(value)) ? "—" : value;
  return <div className={`${styles.metric} ${featured ? styles.metricFeatured : ""} ${className}`}><span className={styles.metricLabel}>{label}</span><strong className={styles.metricValue}>{safeValue}</strong>{hint && <span className={styles.metricHint}>{hint}</span>}</div>;
}
