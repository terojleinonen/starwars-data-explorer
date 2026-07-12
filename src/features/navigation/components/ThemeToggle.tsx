"use client";

import { useEffect, useState } from "react";
import styles from "../styles/ThemeToggle.module.css";

type Theme = "dark" | "light";

/* =========================
   HELPERS
========================= */

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "dark";

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

/* =========================
   COMPONENT
========================= */

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");

  /* =========================
     INITIAL MOUNT
  ========================= */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const saved = localStorage.getItem("theme") as Theme | null;
    setTheme(saved ?? getSystemTheme());
  }, []);

  /* =========================
     APPLY THEME
  ========================= */
  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme);
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  /* =========================
     SYSTEM SYNC
  ========================= */
  useEffect(() => {
    if (!mounted) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const listener = () => {
      const saved = localStorage.getItem("theme");

      // only follow system if user hasn't explicitly chosen
      if (!saved) {
        setTheme(media.matches ? "dark" : "light");
      }
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [mounted]);

  /* =========================
     TOGGLE
  ========================= */
  const toggle = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  /* =========================
     UI
  ========================= */
  return (
    <button
      onClick={toggle}
      className={styles.toggle}
      aria-label="Toggle theme"
      data-theme={mounted ? theme : "dark"}
    >
      <div className={styles.track}>
        <div className={styles.thumb} />
      </div>

      <span className={styles.label}>
        {(!mounted || theme === "dark") ? "Dark" : "Light"}
      </span>
    </button>
  );
}