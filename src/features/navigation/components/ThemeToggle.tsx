"use client";

import styles from "../styles/ThemeToggle.module.css";
import { useTheme } from "@/theme/ThemeProvider";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();


  

  return (
    <div className={styles.wrapper} data-theme={theme}>
      {/* sliding holo indicator */}
      <div className={styles.indicator} />

      <button
        onClick={() => setTheme("dark")}
        aria-pressed={theme === "dark"}
        aria-label="Switch to dark theme"
      >
        <span>DARK</span>
      </button>

      <button
        onClick={() => setTheme("light")}
        aria-pressed={theme === "light"}
        aria-label="Switch to light theme"
      >
        <span>LIGHT</span>
      </button>
    </div>
  );
}