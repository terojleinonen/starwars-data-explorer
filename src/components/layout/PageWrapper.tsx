"use client";

import type { ReactNode } from "react";
import styles from "./PageWrapper.module.css";
import type { SwapiType } from "@/components/types/swapi-types";

import AtmosphereLayer from "./AtmosphereLayer";
import CartographyBackground from "./CartographyBackground";

type Props = {
  children: ReactNode;
  category?: SwapiType;
};

function accentVar(category?: SwapiType) {
  switch (category) {
    case "films":
      return "var(--accent-films)";
    case "people":
      return "var(--accent-people)";
    case "planets":
      return "var(--accent-planets)";
    case "starships":
      return "var(--accent-starships)";
    case "vehicles":
      return "var(--accent-vehicles)";
    case "species":
      return "var(--accent-species)";
    default:
      return "var(--accent-people)";
  }
}

export default function PageWrapper({ children, category }: Props) {
  return (
    <div
      className={styles.wrapper}
      data-category={category}
      style={{
        // ✅ This is the missing “power cable” for your entire background system
        ["--category-accent" as any]: accentVar(category),
      }}
    >
      {/* ================= BACKGROUND (paint-only) ================= */}
        {/* ✅ Give cartography the category so constellations render */}
        <CartographyBackground  />
        {/* ✅ Atmosphere is glow-only now */}
        <AtmosphereLayer category={category} />

      {/* ================= CONTENT SURFACE ================= */}
      <div className={styles.surface}>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}