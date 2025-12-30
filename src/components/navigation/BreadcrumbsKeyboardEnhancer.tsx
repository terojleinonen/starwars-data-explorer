"use client";

import { useEffect } from "react";

export default function BreadcrumbsKeyboardEnhancer() {
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>(
      "[data-breadcrumbs]"
    );
    if (!nav) return;

    const links = Array.from(
      nav.querySelectorAll<HTMLAnchorElement>("a")
    );

    if (links.length === 0) return;

    function onKeyDown(e: KeyboardEvent) {
      if (
        e.key !== "ArrowLeft" &&
        e.key !== "ArrowRight"
      ) {
        return;
      }

      const active = document.activeElement;
      const index = links.indexOf(
        active as HTMLAnchorElement
      );

      if (index === -1) return;

      e.preventDefault();

      const nextIndex =
        e.key === "ArrowRight"
          ? Math.min(index + 1, links.length - 1)
          : Math.max(index - 1, 0);

      links[nextIndex]?.focus();
    }

    nav.addEventListener("keydown", onKeyDown);
    return () =>
      nav.removeEventListener("keydown", onKeyDown);
  }, []);

  return null;
}