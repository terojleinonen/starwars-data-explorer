"use client";

import { useEffect, useState } from "react";

export function useParallax(multiplier: number) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setOffset(window.scrollY * multiplier);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [multiplier]);

  return offset;
}