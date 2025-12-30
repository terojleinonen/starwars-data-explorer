"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const STORAGE_KEY = "theme";

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";

  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored) return stored;

  return getSystemTheme();
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [isManual, setIsManual] = useState(false);

  // Apply theme to <html>
  function applyTheme(next: Theme) {
    document.documentElement.dataset.theme = next;
    setTheme(next);
  }

  // Initial load
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial = stored ?? getSystemTheme();

    setIsManual(!!stored);
    applyTheme(initial);
  }, []);

  // Listen to OS theme changes
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    function handleChange() {
      if (!isManual) {
        applyTheme(getSystemTheme());
      }
    }

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [isManual]);

  // User toggle
  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    setIsManual(true);
    applyTheme(next);
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title="Toggle theme"
      style={{
        background: "none",
        border: "none",
        color: "var(--text-secondary)",
        cursor: "pointer",
        padding: "6px",
        fontSize: "14px",
      }}
    >
      {theme === "dark" ? "☀︎" : "☾"}
    </button>
  );
}