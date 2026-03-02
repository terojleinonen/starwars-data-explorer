"use client";

import React from "react";
import type { SwapiType } from "@/lib/swapi/swapiTypes";
import { Navigation } from "@/features/navigation";
import { CartographyBackground } from "@/features/cartography";
import { ScrollViewport, AtmosphereLayer } from "@/features/layout";
import styles from "../styles/PageWrapper.module.css";

type Props = {
  children: React.ReactNode;
  category?: SwapiType;
  recordId?: number | string;
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

export default function PageWrapper({
  children,
  category,
  recordId,
}: Props) {

  return (
    <div className={styles.page}
    data-category={category}
    style={{
        // ✅ This is the missing “power cable” for your entire background system
        ["--category-accent" as any]: accentVar(category),
      }}
    >
      {/* Navigation always stays on top */}
      <Navigation />
      {/* Cartography background */}
      <CartographyBackground
        category={category}
        recordId={recordId}
        className={styles.background}
      />
      {/* Atmosphere layer */}
      <AtmosphereLayer category={category} />
      {/* Main page content */}
      <main className={styles.content}>
          {children}
      </main>
    </div>
  );
}