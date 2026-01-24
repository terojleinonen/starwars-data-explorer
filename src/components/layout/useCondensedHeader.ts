// src/components/layout/useCondensedHeader.ts
"use client";

import { useEffect, useState } from "react";

export function useCondensedHeader(
  scrollEl: HTMLElement | null,
  threshold = 48
) {
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    if (!scrollEl) return;

    const onScroll = () => {
      setCondensed(scrollEl.scrollTop > threshold);
    };

    onScroll();
    scrollEl.addEventListener("scroll", onScroll, { passive: true });

    return () => scrollEl.removeEventListener("scroll", onScroll);
  }, [scrollEl, threshold]);

  return condensed;
}