"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import styles from "./MobileNavSheet.module.css";
import type { SwapiType } from "@/components/types/swapi-types";

type Props = {
  open: boolean;
  onClose: () => void;
};

const CATEGORIES: { key: SwapiType; label: string }[] = [
  { key: "people", label: "People" },
  { key: "films", label: "Films" },
  { key: "planets", label: "Planets" },
  { key: "starships", label: "Starships" },
  { key: "vehicles", label: "Vehicles" },
  { key: "species", label: "Species" },
];

export default function MobileNavSheet({ open, onClose }: Props) {
  // ⛔ Lock body scroll while menu is open
  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ⛔ Do not render at all when closed
  if (!open) return null;

  // ⛔ SSR-safe portal mount
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
      onClick={onClose}
    >
      {/* Stop propagation so clicks inside sheet don't close it */}
      <div
        className={styles.sheet}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <span className={styles.title}>Navigation</span>
          <button
            className={styles.close}
            onClick={onClose}
            aria-label="Close menu"
          >
            ✕
          </button>
        </header>

        <nav className={styles.nav}>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.key}
              href={`/${cat.key}`}
              className={styles.link}
              onClick={onClose}
            >
              {cat.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>,
    document.body
  );
}