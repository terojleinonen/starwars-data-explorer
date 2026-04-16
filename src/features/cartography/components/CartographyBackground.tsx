"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "../styles/CartographyBackground.module.css";

type Theme = "dark" | "light";

export default function CartographyBackground() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const update = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    };

    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const route = getRouteType(pathname);

  return (
    <div className={styles.root}>
      {theme === "dark" ? (
        <DarkLayer route={route} />
      ) : (
        <LightLayer route={route} />
      )}
    </div>
  );
}

/* =========================
   ROUTE LOGIC
========================= */

function getRouteType(path: string) {
  if (path.startsWith("/films")) return "films";
  if (path.startsWith("/planets")) return "planets";
  if (path.startsWith("/people")) return "people";
  if (path.startsWith("/starships")) return "starships";
  if (path.startsWith("/vehicles")) return "vehicles";
  if (path.startsWith("/species")) return "species";
  if (path.split("/").length > 2) return "detail";

  return "home";
}

/* =========================
   DARK
========================= */

function DarkLayer({ route }: { route: string }) {
  return (
    <>
      <div className={styles.stars} />

      {route === "films" && <div className={styles.cinematicGlow} />}
      {route === "planets" && <div className={styles.orbitsDark} />}
      {route === "starships" && <div className={styles.radar} />}
      {route === "people" && <div className={styles.gridDark} />}
      {route === "detail" && <div className={styles.focusDark} />}
    </>
  );
}

/* =========================
   LIGHT
========================= */

function LightLayer({ route }: { route: string }) {
  return (
    <>
      <div className={styles.baseLight} />

      {route === "films" && <div className={styles.filmLight} />}
      {route === "planets" && <div className={styles.orbitsLight} />}
      {route === "people" && <div className={styles.gridLight} />}
      {route === "starships" && <div className={styles.radarLight} />}
      {route === "detail" && <div className={styles.focusLight} />}
    </>
  );
}