"use client";

import { useEffect, useState } from "react";

export function useNavParallax() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;

      // Clamp 0 → 120px scroll into 0 → 1 range
      const p = Math.min(y / 120, 1);

      setProgress(p);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}