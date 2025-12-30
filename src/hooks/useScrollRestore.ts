"use client";

import { useEffect, useRef } from "react";

export function useScrollRestore(key: string) {
  const restored = useRef(false);

  // Restore scroll on mount
  useEffect(() => {
    if (restored.current) return;

    const stored = sessionStorage.getItem(key);
    if (stored) {
      window.scrollTo(0, Number(stored));
    }

    restored.current = true;
  }, [key]);

  // Save scroll on unmount / navigation
  useEffect(() => {
    function save() {
      sessionStorage.setItem(
        key,
        String(window.scrollY)
      );
    }

    window.addEventListener("beforeunload", save);
    window.addEventListener("pagehide", save);

    return () => {
      save();
      window.removeEventListener("beforeunload", save);
      window.removeEventListener("pagehide", save);
    };
  }, [key]);
}