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

  /* ✅ INITIAL STATE (NO EFFECT SETSTATE) */
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";

    const saved = localStorage.getItem("theme") as Theme | null;
    return saved ?? getSystemTheme();
  });

  /* =========================
     APPLY THEME
  ========================= */

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* =========================
     SYSTEM SYNC
  ========================= */

  useEffect(() => {
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
  }, []);

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
      data-theme={theme}
    >
      <div className={styles.track}>
        <div className={styles.thumb} />
      </div>

      <span className={styles.label}>
        {theme === "dark" ? "Dark" : "Light"}
      </span>
    </button>
  );
}