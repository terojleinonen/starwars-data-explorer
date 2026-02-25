// src/navigation/useRegisterNavigation.ts
"use client";

import { useEffect, useRef } from "react";
import { useNavigationHistory } from "./NavigationHistoryContext";

type Params = {
  label: string | undefined;
  href: string | undefined;
};

/**
 * Registers the current page into navigation history.
 *
 * - Client-only
 * - Idempotent (runs once per page)
 * - Requires resolved label + href
 * - Safe for Category and Details pages
 */
export function useRegisterNavigation({ label, href }: Params) {
  const { register } = useNavigationHistory();

  // Prevent double-registration (React strict mode, rerenders, etc.)
  const hasRegisteredRef = useRef(false);

  useEffect(() => {
    // Do nothing until we have meaningful data
    if (!label || !href) return;

    // Register only once per page lifecycle
    if (hasRegisteredRef.current) return;

    register({ label, href });
    hasRegisteredRef.current = true;
  }, [label, href, register]);
}