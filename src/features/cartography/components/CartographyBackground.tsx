"use client";

import { useEffect, useState } from "react";
import styles from "../styles/CartographyBackground.module.css";
import CartographySvgDark from "./CartographySvgDark";
import CartographySvgLight from "./CartographySvgLight";
import { useTheme } from "@/theme/ThemeProvider";

type Props = {
  theme?: "dark" | "light";
  className?: string;
};

export default function CartographyBackground({
  theme,
  className = "",
}: Props) {
  const { theme: appTheme } = useTheme();
  const activeTheme = theme || appTheme;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <div className={`${styles.root} ${styles[activeTheme]} ${className} cartography`}>
      {/* BASE IMAGE LAYER */}
      <div className={styles.imageLayer} />

      {/* SVG CARTOGRAPHY */}
      <div className={styles.svgLayer}>
        {activeTheme === "dark" ? (
          <CartographySvgDark />
        ) : (
          <CartographySvgLight />
        )}
      </div>

      {/* GRID */}
      <div className={styles.gridLayer} />

      {/* STARS / PARTICLES */}
      <div className={styles.starsLayer} />

      {/* GLOW / FOG */}
      <div className={styles.glowLayer} />
    </div>
  );
}