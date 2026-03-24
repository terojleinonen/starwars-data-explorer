"use client";

import React from "react";
import { Navigation } from "@/features/navigation";
import { CartographyBackground } from "@/features/cartography";
import { AtmosphereLayer } from "@/features/layout";
import styles from "../styles/PageWrapper.module.css";

type Props = {
  children: React.ReactNode;
  category?: string;
};

export default function PageWrapper({
  children,
  category,
}: Props) {

  return (
    <div className={styles.page}>
      {/* Navigation always stays on top */}
      <Navigation />
      {/* Cartography background */}
      <CartographyBackground
        className={styles.background}
        category={category}
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