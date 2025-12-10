// FILE: DetailsPage.tsx
import React from "react";
import { useParams } from "react-router-dom";
import { useSwapi } from "../hooks/useSwapi";
import { SwapiType } from "./types/swapi-types";
import styles from "./DetailsPage.module.css";

interface DetailsPageProps {
  theme: "light" | "dark";
  type: SwapiType;
}

const DetailsPage: React.FC<DetailsPageProps> = ({ theme, type }) => {
  const { id } = useParams();
  const { data, loading, error } = useSwapi(type, id);

  if (loading) return <div className={styles.loading}>Loading…</div>;
  if (error || !data) return <div className={styles.loading}>Error loading data</div>;

  const heading =
    (data as any)?.name ??
    (data as any)?.title ??
    `Record ${id}`;

  return (
    <div className={`${styles.pageWrapper} ${styles[theme]}`}>
      <div className={styles.headerPanel}>
        <h1>{heading}</h1>
        <p>ID: {id}</p>
      </div>

      <div className={styles.dataPanel}>
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className={styles.row}>
            <span className={styles.label}>{key}</span>
            <span className={styles.value}>
              {Array.isArray(value) ? `${value.length} items` : String(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailsPage;
// FILE: DetailsPage.tsx