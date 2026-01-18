"use client";

import { useCallback } from "react";
import type { SwapiType } from "@/components/types/swapi-types";

export function useAtmospherePreview() {
  const root = document.querySelector(
    "[data-atmosphere-root]"
  ) as HTMLElement | null;

  const setPreview = useCallback(
    (category?: SwapiType) => {
      const fn = (root as any)?.dataset?.setPreview;
      if (typeof fn === "function") {
        fn(category);
      }
    },
    [root]
  );

  return setPreview;
}