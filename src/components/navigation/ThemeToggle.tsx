"use client";

import { useTheme } from "@/theme/ThemeProvider";
import { toggleHaptic } from "@/utils/haptics";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  // Avoid rendering wrong icon during hydration
  if (!theme) return null;

  return (
    <button
      onClick={() => {
        toggleHaptic();
        toggleTheme();
      }}
      onTouchStart={toggleHaptic}
      
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