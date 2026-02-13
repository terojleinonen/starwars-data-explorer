"use client";

import { useState } from 'react';
import NavLink from "@/components/navigation/NavLink";
import ThemeToggle from "@/components/navigation/ThemeToggle";
import styles from "./Navigation.module.css";

export default function Navigation() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.nav} data-open={isMenuOpen}>
      <div className={styles.navTop}>
        <NavLink href="/" label="Home" className={styles.brand}>
            <div className={styles.logo}>
              GALACTIC ARCHIVE
            </div>
            <div className={styles.tagline}>
              Star Wars Data Interface · SWAPI
            </div>
        </NavLink>
        <div className={`${styles.navLinks} ${isMenuOpen ? styles.navLinksOpen : ''}`}>
          <NavLink href="/people" label="People">People</NavLink>
          <NavLink href="/planets" label="Planets">Planets</NavLink>
          <NavLink href="/films" label="Films">Films</NavLink>
          <NavLink href="/starships" label="Starships">Starships</NavLink>
          <NavLink href="/vehicles" label="Vehicles">Vehicles</NavLink>
          <NavLink href="/species" label="Species">Species</NavLink>
          <div className={styles.themeToggleMobile}>
            <ThemeToggle />
          </div>
        </div>
        <div className={styles.navTopActions}>
          <div className={styles.themeToggleDesktop}>
            <ThemeToggle />
          </div>
          <div className={styles.burger} onClick={() => setMenuOpen(!isMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </nav>
  );
}
