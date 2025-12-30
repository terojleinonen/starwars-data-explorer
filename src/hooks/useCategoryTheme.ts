"use client";

import { useEffect } from "react";
import type { SwapiType } from "@/components/types/swapi-types";
import { CATEGORY_THEME } from "@/theme/CategoryTheme";

export function useCategoryTheme(category?: SwapiType) {
  useEffect(() => {
    if (!category) return;

    const theme = CATEGORY_THEME[category];
    if (!theme) return;

    const root = document.documentElement;

    root.style.setProperty("--accent-rgb", theme.accentRgb);

    return () => {
      root.style.removeProperty("--accent-rgb");
    };
  }, [category]);
}