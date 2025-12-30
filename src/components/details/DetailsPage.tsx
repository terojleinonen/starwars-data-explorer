import styles from "./DetailsPage.module.css";
import type { ReactNode } from "react";
import type { SwapiType } from "@/components/types/swapi-types";

export type DetailsStat = {
  label: string;
  value: ReactNode;
};

export type DetailsPageProps = {
  category: SwapiType | string;
  title?: ReactNode;
  description?: ReactNode;
  stats?: DetailsStat[];
  children: ReactNode;
};

function toCategoryLabel(category: SwapiType | string) {
  const raw = String(category ?? "");
  return raw ? raw.toUpperCase() : "ARCHIVES";
}

export default function DetailsPage({
  category,
  title,
  description,
  stats = [],
  children,
}: DetailsPageProps) {
  return (
    <section className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <span className={styles.eyebrow}>{toCategoryLabel(category)}</span>
        </div>

        <div className={styles.headerMain}>
          <h1 className={styles.title}>
            {title ?? "Galactic Record"}
          </h1>

          {description ? (
            <p className={styles.description}>{description}</p>
          ) : null}
        </div>

        {stats.length > 0 ? (
          <dl className={styles.stats}>
            {stats.map((s) => (
              <div key={s.label} className={styles.stat}>
                <dt className={styles.statLabel}>{s.label}</dt>
                <dd className={styles.statValue}>{s.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </header>

      {/* Body */}
      <div className={styles.body}>{children}</div>
    </section>
  );
}
