"use client";

import CartographyBackground from "./CartographyBackground";
import AtmosphereLayer from "./AtmosphereLayer";
import ScrollViewport from "./ScrollViewport";
import styles from "./PageWrapper.module.css";
import type { SwapiType } from "@/components/types/swapi-types";

type Props = {
  children: React.ReactNode;
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
      <CartographyBackground />
      <AtmosphereLayer category={category} 
      />

      <ScrollViewport>
        {children}
      </ScrollViewport>
    </div>
  );
}