"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import styles from "./PageWrapper.module.css";
import type { SwapiType } from "@/components/types/swapi-types";

type Props = {
  children: ReactNode;
  category?: SwapiType;
};

export default function PageWrapper({
  children,
  category,
}: Props) {
  const pathname = usePathname();
  const [fade, setFade] = useState(false);
  const [activeCategory, setActiveCategory] = useState(category);

  useEffect(() => {
    // start fade-out
    setFade(true);

    const timeout = setTimeout(() => {
      // switch category mid-fade
      setActiveCategory(category);
      setFade(false);
    }, 240); // short + subtle

    return () => clearTimeout(timeout);
  }, [pathname, category]);

  return (
    <div
      className={styles.root}
      data-category={activeCategory}
    >
      <div
        className={`${styles.atmosphere} ${
          fade ? styles.fade : ""
        }`}
      />

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}