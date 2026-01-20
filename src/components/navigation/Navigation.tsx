"use client";

import Link from "next/link";
import { useState, useEffect} from "react";
import { usePathname } from "next/navigation";
import styles from "./Navigation.module.css";
import ThemeToggle from "./ThemeToggle";
import { useAtmosphere } from "@/components/layout/AtmosphereContext";
import MobileNavSheet from "./MobileNavSheet";
import type { SwapiType } from "@/components/types/swapi-types";
import { createPortal } from "react-dom";
import NavToggleButton from "./NavToggleButton";

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
  const { setCategory } = useAtmosphere();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
  if (mobileOpen) document.body.style.overflow = "hidden";
  else document.body.style.overflow = "";
  }, [mobileOpen]);

  return (
    <nav className={styles.nav}>
      {/* ================= BRAND ================= */}
      <Link
        href="/"
        className={styles.brand}
        data-nav-label="Home"
        onMouseEnter={() => setCategory(undefined)}
      >
        Galactic Archives
      </Link>

      {/* ================= DESKTOP LINKS ================= */}
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
              data-nav-label={cat.label}
              onMouseEnter={() => setCategory(cat.key)}
              onFocus={() => setCategory(cat.key)}
            >
              {cat.label}
            </Link>
          );
        })}
      </div>

      {/* ================= CONTROLS ================= */}
      <div className={styles.controls}>
        <ThemeToggle />
        <div className={styles.mobileToggle}>
          <NavToggleButton
            open={mobileOpen}
            onToggle={() => setMobileOpen(!mobileOpen)}
            />
            {mobileOpen ? createPortal(
              <MobileNavSheet
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                />,
                document.body
              ) : null} 
          </div>
        </div>    
    </nav>
  );
}