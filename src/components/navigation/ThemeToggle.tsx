"use client";

import { useTheme } from "@/theme/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

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