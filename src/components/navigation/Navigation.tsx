"use client";

import Link from "next/link";
import styles from "./Navigation.module.css";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const CATEGORIES = [
  { key: "people", label: "People" },
  { key: "films", label: "Films" },
  { key: "planets", label: "Planets" },
  { key: "starships", label: "Starships" },
  { key: "vehicles", label: "Vehicles" },
  { key: "species", label: "Species" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Link href="/">Galactic Archives</Link>        
      </div>

      <div className={styles.links}>
        {CATEGORIES.map((cat) => {
          const active = pathname.startsWith(`/${cat.key}`);

          return (
            <Link
              key={cat.key}
              href={`/${cat.key}`}
              className={`${styles.link} ${
                active ? styles.active : ""
              }`}
            >
              {cat.label}
            </Link>
          );
        })}
      </div>
      <ThemeToggle />
    </nav>
  );
}