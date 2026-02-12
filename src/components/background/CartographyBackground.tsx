"use client";

import { useEffect, useRef, useState } from "react";
import type { SwapiType } from "@/components/types/swapi-types";
import styles from "./CartographyBackground.module.css";
import { useTheme } from "@/theme/ThemeProvider";

import CartographySvgDark from "./CartographySvgDark";
import CartographySvgLight from "./CartographySvgLight";

type Props = {
  category?: SwapiType;
};

function getDeviceClass(): "desktop" | "tablet" | "mobile" {
  if (typeof window === "undefined") return "desktop";

  const w = window.innerWidth;

  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

export default function CartographyBackground({ category }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">(
    getDeviceClass()
  );

  const { theme } = useTheme();

  useEffect(() => {
    const onResize = () => setDevice(getDeviceClass());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Parallax logic
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    let raf: number;

    const onScroll = () => {
      raf = requestAnimationFrame(() => {
        const scrollY = window.scrollY || 0;

        el.style.setProperty("--p-small", `${scrollY * 0.03}px`);
        el.style.setProperty("--p-medium", `${scrollY * 0.06}px`);
        el.style.setProperty("--p-large", `${scrollY * 0.09}px`);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.cartography} aria-hidden>
      {theme === "dark" ? (
        <CartographySvgDark category={category} device={device} />
      ) : (
        <CartographySvgLight category={category} device={device} />
      )}
      <div className={styles.starfield} />
    </div>
  );
}