"use client";

import { useEffect, useRef, type ReactNode, type UIEvent } from "react";
import styles from "./ScrollViewport.module.css";

type Props = {
  children: ReactNode;
};

export default function ScrollViewport({ children }: Props) {
  const viewportRef = useRef<HTMLDivElement | null>(null);

  // Sync scroll depth → CSS variable
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    let raf = 0;

    const updateDepth = () => {
      cancelAnimationFrame(raf);

      raf = requestAnimationFrame(() => {
        const max = el.scrollHeight - el.clientHeight;
        const depth = max > 0 ? el.scrollTop / max : 0;

        el.style.setProperty(
          "--scrollDepth",
          Math.min(depth, 1).toFixed(3)
        );
      });
    };

    updateDepth();
    el.addEventListener("scroll", updateDepth, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", updateDepth);
    };
  }, []);

  return (
    <div ref={viewportRef} className={styles.viewport}>
      <div className={styles.content}>{children}</div>
    </div>
  );
}