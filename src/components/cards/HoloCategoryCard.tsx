import React from "react";
import Link from "next/link";
import styles from "./HoloCategoryCard.module.css";
import { useAtmosphere } from "@/components/layout/AtmosphereContext";
import { SwapiType } from "../types/swapi-types";

const CATEGORIES: { key: SwapiType; label: string }[] = [
  { key: "people", label: "People" },
  { key: "films", label: "Films" },
  { key: "planets", label: "Planets" },
  { key: "starships", label: "Starships" },
  { key: "vehicles", label: "Vehicles" },
  { key: "species", label: "Species" },
];

type Props = {
  title: string;
  subtitle: string;
  href?: string;
};

export default function HoloCategoryCard({
  title,
  subtitle,
}: Props) {
  const { setActiveHighlight } = useAtmosphere();

  return (
    <section  className={styles.wrapper}>
      <Link href={subtitle === "Individuals & factions" ? "/people" : subtitle === "Worlds & environments" ? "/planets" : subtitle === "Interstellar vessels" ? "/starships" : subtitle === "Cinematic records" ? "/films" : subtitle === "Biological classifications" ? "/species" : "/vehicles"}
      onMouseEnter={() => setActiveHighlight(CATEGORIES.find(cat => cat.label === title)?.key || null)}
      onMouseLeave={() => setActiveHighlight(null)}
      onFocus={()=> setActiveHighlight(CATEGORIES.find(cat => cat.label === title)?.key || null)}
      onBlur={() => setActiveHighlight(null)}
      >
        <article
          className={styles.card}
        >
          {/* GLASS SURFACE */}
          <div className={styles.surface} />

        {/* TECH FRAME */}
        <div className={styles.frame} />

        {/* MOVING SCANLINE */}
        <div className={styles.scanline} />

        {/* CATEGORY ICON / GLYPH */}
        <div className={styles.glyph} aria-hidden />

        {/* TEXT CONTENT */}
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        
        {/* GLOW EFFECT */}
        <div className={styles.glow} />
      </article>
        </Link>
    </section>
  );
}