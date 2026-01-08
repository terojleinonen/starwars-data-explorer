"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";
const STORAGE_KEY = "theme";

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [isManual, setIsManual] = useState(false);

  function applyTheme(next: Theme) {
    document.documentElement.setAttribute("data-theme", next);
    setTheme(next);
  }

  // Initial load
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial = stored ?? getSystemTheme();

    setIsManual(!!stored);
    applyTheme(initial);
  }, []);

  // Listen to OS changes
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (!isManual) {
        applyTheme(getSystemTheme());
      }
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [isManual]);

  function toggleTheme() {
    if (!theme) return;

    const next: Theme = theme === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    setIsManual(true);
    applyTheme(next);
  }

  // Avoid rendering wrong icon during hydration
  if (!theme) return null;

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