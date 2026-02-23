"use client";

import { useEffect, useRef } from "react";

export default function useParallax(
  strength = 8
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function handleMove(e: MouseEvent) {
      if (!el) return;
      const { innerWidth, innerHeight } = window;

      const x = (e.clientX / innerWidth - 0.5) * strength;
      const y = (e.clientY / innerHeight - 0.5) * strength;

      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    window.addEventListener("mousemove", handleMove);

    return () => {
      window.removeEventListener("mousemove", handleMove);
    };
  }, [strength]);

  return ref;
}