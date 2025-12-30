// FILE: CategoryHeader.tsx
import React from "react";
import styles from "./CategoryHeader.module.css";

interface Props {
  category: string;
  theme: "light" | "dark";
}

const titles: Record<string, string> = {
  films: "Holovid Archive",
  people: "Sentient Profiles",
  planets: "Galactic Cartography",
  species: "Biological Index",
  vehicles: "Transport Registry",
  starships: "Fleet Records",
};

export const CategoryHeader: React.FC<Props> = ({ category, theme }) => {
  const label = titles[category] ?? "Database";

  return (
    <div className={`${styles.wrapper} ${styles[theme]} ${styles[category]}`}>
      <div className={styles.overlay} />
      <h1 className={styles.title}>{label}</h1>
    </div>
  );
};
