"use client";

import { useRef } from "react";
import { prefetchSwapiDetail } from "@/data/swapiPrefetch";

export function usePrefetchOnHover(url?: string) {
  const timer = useRef<number | null>(null);

  function start() {
    if (!url) return;

    timer.current = window.setTimeout(() => {
      prefetchSwapiDetail(url);
    }, 120);
  }

  function cancel() {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }

  return {
    onMouseEnter: start,
    onMouseLeave: cancel,
    onFocus: start,   // keyboard users
    onBlur: cancel,
  };
}