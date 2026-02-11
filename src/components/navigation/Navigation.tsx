"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navigation.module.css";
import ThemeToggle from "./ThemeToggle";
import type { SwapiType } from "@/components/types/swapi-types";
import { useNavParallax } from "@/hooks/useNavParallax";

const CATEGORIES: { key: SwapiType; label: string }[] = [
  { key: "people", label: "People" },
  { key: "films", label: "Films" },
  { key: "planets", label: "Planets" },
  { key: "starships", label: "Starships" },
  { key: "vehicles", label: "Vehicles" },
  { key: "species", label: "Species" },
];

export default function Navigation() {
  const pathname = usePathname();
  const progress = useNavParallax();

  return (
    <nav
      className={styles.nav}
      style={{
        transform: `translateY(${progress * -6}px)`,
        height: `${72 - progress * 12}px`,
        backdropFilter: `blur(${6 + progress * 8}px)`,
        WebkitBackdropFilter: `blur(${6 + progress * 8}px)`,
      }}
    >
      <Link
        href="/"
        data-nav-label="Home"
        className={styles.logo}
        style={{
          transform: `scale(${1 - progress * 0.08})`,
        }}
      >
        Galactic Archives
      </Link>

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
              style={{
                borderBottomColor: `color-mix(in oklab, var(--category-accent), transparent ${60 - progress * 30}%)`
              }}

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