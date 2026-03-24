"use client";

import React from "react";
import { PageWrapper } from "@/features/layout/";
import { CategorySection, HeroSection } from "@/features/landing";
import styles from "../styles/LandingPage.module.css";

export default function LandingPage() {

  return (
    <PageWrapper >
      <main className={styles.page}>
        {/* =====================================================
           HERO SECTION
        ===================================================== */}
        <HeroSection />
        {/* =====================================================
           CATEGORY SECTION
        ===================================================== */}
        <CategorySection />
      </main>
    </PageWrapper>
  );
}