"use client";

import { useSyncExternalStore } from "react";
import styles from "../styles/ThemeToggle.module.css";

type Theme = "dark" | "light";

const THEME_EVENT = "galactic-archive-theme-change";

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getThemeSnapshot(): Theme {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem("theme");
  if (saved === "dark" || saved === "light") return saved;
  return document.documentElement.dataset.theme === "light" ? "light" : getSystemTheme();
}

function subscribe(callback: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemChange = () => {
    if (!localStorage.getItem("theme")) {
      applyTheme(media.matches ? "dark" : "light", false);
      callback();
    }
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key === "theme") callback();
  };
  const onThemeChange = () => callback();

  media.addEventListener("change", onSystemChange);
  window.addEventListener("storage", onStorage);
  window.addEventListener(THEME_EVENT, onThemeChange);

  return () => {
    media.removeEventListener("change", onSystemChange);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(THEME_EVENT, onThemeChange);
  };
}

function applyTheme(theme: Theme, persist = true) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  if (persist) localStorage.setItem("theme", theme);
  window.dispatchEvent(new Event(THEME_EVENT));
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, () => "dark");

  const toggle = () => {
    applyTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggle}
      className={styles.toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      aria-pressed={theme === "dark"}
      data-theme={theme}
    >
      <div className={styles.track}>
        <div className={styles.thumb} />
      </div>
      <span className={styles.label}>{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}
