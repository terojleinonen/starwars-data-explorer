"use client";

import { useEffect } from "react";

type HistoryItem = {
  href: string;
  label: string;
};

const STORAGE_KEY = "nav-history";
const MAX_ITEMS = 20;

export default function NavigationHistoryRecorder() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const link = target.closest("a");
      if (!link) return;

      // Ignore UI controls (back arrow, etc.)
      if (
        link.hasAttribute("data-back-arrow") ||
        link.hasAttribute("data-ignore-nav")
      ) {
        return;
      }

      const href = link.getAttribute("href");
      const label =
        link.getAttribute("data-nav-label");

      // Only record links that declare intent
      if (!href || !label) return;

      const raw =
        sessionStorage.getItem(STORAGE_KEY);
      const history: HistoryItem[] = raw
        ? JSON.parse(raw)
        : [];

      const last = history[history.length - 1];
      if (last?.href === href) return;

      history.push({ href, label });

      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(history.slice(-MAX_ITEMS))
      );
    }

    document.addEventListener("click", onClick);
    return () =>
      document.removeEventListener("click", onClick);
  }, []);

  return null;
}