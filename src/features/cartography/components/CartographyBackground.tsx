"use client";

import { useEffect, useState } from "react";
import styles from "../styles/CartographyBackground.module.css";

export default function CartographyBackground() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const root = document.documentElement;

    const updateTheme = () => {
      const isDark =
        root.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;

      setTheme(isDark ? "dark" : "light");
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.root} aria-hidden>
      <div
        className={`${styles.layer} ${
          theme === "dark" ? styles.dark : styles.light
        }`}
      />

      {/* depth layers */}
      <div className={styles.depthBack} />
      <div className={styles.depthFront} />
    </div>
  );
}