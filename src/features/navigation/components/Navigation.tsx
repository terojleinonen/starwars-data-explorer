"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import styles from "../styles/Navigation.module.css";

const NAV_ITEMS = [
  { label: "People", code: "01", href: "/people" },
  { label: "Planets", code: "02", href: "/planets" },
  { label: "Starships", code: "03", href: "/starships" },
  { label: "Films", code: "04", href: "/films" },
  { label: "Species", code: "05", href: "/species" },
  { label: "Vehicles", code: "06", href: "/vehicles" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();


  return (
    <header className={styles.shell}>
      <nav className={styles.nav} aria-label="Primary navigation">
        <Link href="/" className={styles.logo} aria-label="Galactic Archive home" onClick={() => setOpen(false)}>
          <span className={styles.logoMark} aria-hidden="true">GA</span>
          <span className={styles.logoCopy}>
            <strong>Galactic Archive</strong>
            <small>Public data terminal</small>
          </span>
        </Link>

        <div className={styles.links}>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={styles.link}
                data-active={active || undefined}
                aria-current={active ? "page" : undefined}
              >
                <span>{item.code}</span>{item.label}
              </Link>
            );
          })}
        </div>

        <div className={styles.actions}>
          <ThemeToggle />
          <button
            className={styles.menuButton}
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div id="mobile-navigation" className={styles.mobileMenu} data-open={open || undefined}>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)}>
              <span>{item.code}</span><strong>{item.label}</strong><em>Open sector</em>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
