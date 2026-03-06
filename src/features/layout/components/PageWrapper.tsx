"use client";

import React from "react";
import type { SwapiType } from "@/lib/swapi/swapiTypes";
import { Navigation } from "@/features/navigation";
import { CartographyBackground } from "@/features/cartography";
import { AtmosphereLayer } from "@/features/layout";
import styles from "../styles/PageWrapper.module.css";

type Props = {
  children: React.ReactNode;
  category?: SwapiType;
  recordId?: number | string;
};

export default function PageWrapper({
  children,
  category,
  recordId,
}: Props) {

  return (
    <div className={styles.page}>
      {/* Navigation always stays on top */}
      <Navigation />
      {/* Cartography background */}
      <CartographyBackground
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