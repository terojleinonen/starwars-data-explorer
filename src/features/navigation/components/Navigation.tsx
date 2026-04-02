"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import styles from "../styles/Navigation.module.css";

const NAV_ITEMS = [
  { label: "People", href: "/people" },
  { label: "Planets", href: "/planets" },
  { label: "Starships", href: "/starships" },
  { label: "Films", href: "/films" },
  { label: "Species", href: "/species" },
  { label: "Vehicles", href: "/vehicles" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleNavigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        {/* LOGO */}
        <Link
          href="/"
          className={styles.logo}
          onMouseEnter={() => router.prefetch("/")}
        >
          GALACTIC ARCHIVE
        </Link>

        {/* DESKTOP NAV */}
        <div className={styles.links}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.link}
              onMouseEnter={() => router.prefetch(item.href)}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className={styles.right}>
          <ThemeToggle />

          {/* MOBILE MENU BUTTON */}
          <button
            className={styles.menuButton}
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className={styles.mobileMenu}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.href}
              className={styles.mobileLink}
              onClick={() => handleNavigate(item.href)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}