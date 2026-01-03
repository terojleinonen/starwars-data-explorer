"use client";

import React from "react";
import styles from "./PageWrapper.module.css";

const clamp01 = (n: number) =>
  Math.max(0, Math.min(1, n));

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const h = Math.max(1, window.innerHeight);
        const t = clamp01(y / (h * 1.2));

        el.style.setProperty("--gridOpacity", String(0.18 + t * 0.18));
        el.style.setProperty("--contentGlow", String(0.06 + t * 0.14));
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className={styles.pageWrapper}>
      <div className={styles.holoGrid} />
      <div className={styles.pageContent}>
        {children}
      </div>
    </div>
  );
}