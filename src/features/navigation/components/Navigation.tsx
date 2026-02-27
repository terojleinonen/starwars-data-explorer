"use client";

import { useState } from "react";
import { NavLink, ThemeToggle } from "@/features/navigation";
import styles from "../styles/Navigation.module.css";

export default function Navigation() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  function toggleMenu() {
    setMenuOpen((prev) => !prev);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav
      className={styles.nav}
      data-open={isMenuOpen}
      aria-label="Main navigation"
    >
      <div className={styles.navContainer}>
        <div className={styles.navTop}>

          {/* Brand */}
          <NavLink
            href="/"
            label="Home"
            className={styles.brand}
            onClick={closeMenu}
          >
            <div className={styles.logo}>
              GALACTIC ARCHIVE
            </div>
            <div className={styles.tagline}>
              Star Wars Data Interface · SWAPI
            </div>
          </NavLink>

          {/* Navigation links */}
          <div
            className={`${styles.navLinks} ${
              isMenuOpen ? styles.navLinksOpen : ""
            }`}
          >
            <NavLink href="/people" label="People" onClick={closeMenu}>
              People
            </NavLink>

            <NavLink href="/planets" label="Planets" onClick={closeMenu}>
              Planets
            </NavLink>

            <NavLink href="/films" label="Films" onClick={closeMenu}>
              Films
            </NavLink>

            <NavLink href="/starships" label="Starships" onClick={closeMenu}>
              Starships
            </NavLink>

            <NavLink href="/vehicles" label="Vehicles" onClick={closeMenu}>
              Vehicles
            </NavLink>

            <NavLink href="/species" label="Species" onClick={closeMenu}>
              Species
            </NavLink>

            <div className={styles.themeToggleMobile}>
              <ThemeToggle />
            </div>
          </div>

          {/* Right side controls */}
          <div className={styles.navTopActions}>
            <div className={styles.themeToggleDesktop}>
              <ThemeToggle />
            </div>

            <button
              className={styles.burger}
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}