// FILE: CategoryPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useSwapiList } from "../hooks/useSwapiList";
import type { SwapiType } from "./types/swapi-types";
import styles from "./CategoryPage.module.css";

interface Props {
  theme: "light" | "dark";
  type: SwapiType;
  title: string;
}

const CategoryPage: React.FC<Props> = ({ theme, type, title }) => {
  const { data, loading } = useSwapiList(type);

  if (loading) return <div className={styles.loading}>Loading…</div>;

  function getItemLabel(item: any): string {
  return item.name ?? item.title ?? "Unknown";
}


  return (
    <div className={`${styles.pageWrapper} ${styles[theme]}`}>
      <h1 className={styles.pageTitle}>{title}</h1>

      <div className={styles.grid}>
        {data.map((item) => {
        const id = item.url.split("/").filter(Boolean).pop();
        return (
          <Link key={id} to={`/${type}/${id}`} className={styles.card}>
            <h3>{getItemLabel(item)}</h3>
          </Link>
        );
        })}
      </div>
    </div>
  );
};

export default CategoryPage;
// FILE: CategoryPage.tsx