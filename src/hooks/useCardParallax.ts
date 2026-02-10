"use client";

import { useRef } from "react";

export function useCardParallax<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  function onMouseMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const px = (x / rect.width - 0.5) * 2;
    const py = (y / rect.height - 0.5) * 2;

    const rotateX = -py * 4;
    const rotateY = px * 6;

    el.style.transform = `
      perspective(800px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-2px)
    `;

    // ---- NEW: holographic sweep position ----
    el.style.setProperty("--holo-x", `${x}px`);
    el.style.setProperty("--holo-y", `${y}px`);
  }

  function onMouseLeave() {
    const el = ref.current;
    if (!el) return;

    el.style.transform = `
      perspective(800px)
      rotateX(0deg)
      rotateY(0deg)
      translateY(0)
    `;
  }

  return {
    ref,
    onMouseMove,
    onMouseLeave,
  };
}