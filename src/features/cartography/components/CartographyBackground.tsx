"use client";

import React, { useEffect, useRef, useState } from "react";
import type { SwapiType } from "@/lib/swapi/swapiTypes";
import styles from "../styles/CartographyBackground.module.css";
import { useTheme } from "@/theme/ThemeProvider";
import useParallax from "@/hooks/motion/useParallax";
import CartographySvgDark from "./CartographySvgDark";
import CartographySvgLight from "./CartographySvgLight";

type Props = {
  className?: string;
  category?: SwapiType; // <-- important: do NOT use children for this
  recordId?: number | string;
};

export default function CartographyBackground({
  className,
  category,
  recordId,
  children,
}: React.PropsWithChildren<Props>) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Parallax on the cartography grid layer
  const gridRef = useParallax(4);

  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">(
    getDeviceClass()
  );

  const { theme } = useTheme();

  useEffect(() => {
    const onResize = () => setDevice(getDeviceClass());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Optional: scroll-driven CSS vars (ONLY if you actually use --p-* in CSS)
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const scrollY = window.scrollY || 0;
        el.style.setProperty("--p-small", `${scrollY * 0.03}px`);
        el.style.setProperty("--p-medium", `${scrollY * 0.06}px`);
        el.style.setProperty("--p-large", `${scrollY * 0.09}px`);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={rootRef} className={`${styles.root} ${theme === "dark" ? styles.dark : styles.light} ${className ?? ""}`}>
      
      <div ref={gridRef} className={styles.svgLayer} aria-hidden="true">
        {theme === "dark" ? (
          <CartographySvgDark category={category} device={device} />
        ) : (
          <CartographySvgLight category={category} device={device} />
        )}
      </div>

      {/* atmospheric layers sit ABOVE svg but BELOW UI */}
      <div className={styles.fog} aria-hidden="true" />
      <div className={styles.starfield} aria-hidden="true" />

      {/* overlays (hero UI etc) */}
      <div className={styles.overlay}>{children}</div>
    </div>
  );
}

function getDeviceClass(): "desktop" | "tablet" | "mobile" {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}