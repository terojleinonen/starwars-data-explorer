// FILE: src/components/Navbar.tsx
// Next.js App Router–compatible premium navbar

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

interface NavbarProps {
  theme: "light" | "dark";
}

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Films", href: "/films" },
  { label: "People", href: "/people" },
  { label: "Planets", href: "/planets" },
  { label: "Species", href: "/species" },
  { label: "Vehicles", href: "/vehicles" },
  { label: "Starships", href: "/starships" },
];

const Navbar: React.FC<NavbarProps> = ({ theme }) => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
   <header className={`${styles.navWrapper} ${styles[theme]}`}>
    <nav
      className={`${styles.navbar} ${
        theme === "dark" ? styles.dark : styles.light
      }`}
    >
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link href="/">SWAPI CONSOLE</Link>
        </div>

        <ul className={styles.navList}>
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${styles.navLink} ${
                  isActive(item.href) ? styles.active : ""
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
    </header>
  );
};

export default Navbar;
// FILE: Navbar.tsx
// Next.js App Router–compatible premium navbar