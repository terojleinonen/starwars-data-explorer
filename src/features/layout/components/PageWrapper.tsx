"use client";

import React from "react";
import { Navigation } from "@/features/navigation";
import { CartographyBackground } from "@/features/cartography";
import styles from "../styles/PageWrapper.module.css";

type Props = {
  children: React.ReactNode;
};

export default function PageWrapper({
  children,
}: Props) {

  return (
    <div className={styles.page}>
      {/* Navigation always stays on top */}
      <Navigation />
      {/* Cartography background */}
      <CartographyBackground />
      {/* Main page content */}
      <main className={styles.content}>        
          {children}     
      </main>
    </div>
  );
}