"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { useAtmospherePreview } from "@/hooks/useAtmospherePreview";

import styles from "./Navigation.module.css";

const CATEGORIES = [
  { key: "people", label: "People" },
  { key: "films", label: "Films" },
  { key: "planets", label: "Planets" },
  { key: "starships", label: "Starships" },
  { key: "vehicles", label: "Vehicles" },
  { key: "species", label: "Species" },
] as const;

export default function Navigation() {
  const pathname = usePathname();
  const previewAtmosphere = useAtmospherePreview();

  return (
    <nav className={styles.nav} aria-label="Primary">
      {/* Brand / Home */}
      <Link
        href="/"
        className={styles.brand}
        data-nav-label="Home"
      >
        Galactic Archives
      </Link>

      {/* Category links */}
      <ul className={styles.list}>
        {CATEGORIES.map((cat) => {
          const isActive =
            pathname === `/${cat.key}` ||
            pathname.startsWith(`/${cat.key}/`);

          return (
            <li key={cat.key}>
              <Link
                href={`/${cat.key}`}
                className={styles.link}
                data-category={cat.key}
                aria-current={isActive ? "page" : undefined}
                data-nav-label={cat.label}
                onMouseEnter={() => previewAtmosphere(cat.key)}
                onMouseLeave={() => previewAtmosphere(undefined)}
              >
                {cat.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Tools */}
      <div className={styles.tools}>
        <ThemeToggle />
      </div>
    </nav>
  );
}