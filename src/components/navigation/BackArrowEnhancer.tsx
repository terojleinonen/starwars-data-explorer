"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "nav-history";

export default function BackArrowEnhancer() {
  const pathname = usePathname();

  useEffect(() => {
    const arrow = document.querySelector(
      "[data-back-arrow]"
    ) as HTMLAnchorElement | null;

    if (!arrow) return;

    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      arrow.style.display = "none";
      return;
    }

    const history: {
      href: string;
      label: string;
    }[] = JSON.parse(raw);

    if (history.length < 2) {
      arrow.style.display = "none";
      return;
    }

    const prev = history[history.length - 2];

    arrow.href = prev.href;
    arrow.textContent = `← Back to ${prev.label}`;
    arrow.style.display = "inline-flex";
  }, [pathname]); // 🔥 SAME FIX

  return null;
}