"use client";

import AtmosphereLayer from "./AtmosphereLayer";
import CartographyBackground from "./CartographyBackground";
import { useAtmosphere } from "./AtmosphereContext";
import styles from "./PageWrapper.module.css";
import type { SwapiType } from "@/components/types/swapi-types";
import { useCondensedHeader } from "./useCondensedHeader";
import { useRef } from "react";

type Props = {
  children: React.ReactNode;
  category?: SwapiType;
};

export default function PageWrapper({ children}: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const condensed = useCondensedHeader(scrollRef.current);
  const { category } = useAtmosphere();

  return (
    <div
      className={styles.wrapper}
      data-category={category}
      style={{
        ["--category-accent" as any]: `var(--accent-${category ?? "people"})`,
      }}
      data-condensed={condensed || undefined}
    >
      <CartographyBackground />
      <AtmosphereLayer category={category} />
      <main ref={scrollRef} className={styles.content}>
        {children}
      </main>
    </div>
  );
}