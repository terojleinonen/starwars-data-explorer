"use client";

import { useEffect, useRef } from "react";

export default function useParallax(strength = 10) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function handleMove(e: MouseEvent) {
      const x = (e.clientX / window.innerWidth - 0.5) * strength;
      const y = (e.clientY / window.innerHeight - 0.5) * strength;

      el!.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    window.addEventListener("mousemove", handleMove);

    return () => window.removeEventListener("mousemove", handleMove);
  }, [strength]);

  return ref;
}