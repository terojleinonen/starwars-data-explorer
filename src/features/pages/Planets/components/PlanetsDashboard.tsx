"use client";

import { useMemo } from "react";
import { useSwapi } from "@/hooks/data/useSwapi";

import UnifiedDashboard from "@/features/dashboard/components/UnifiedDashboard";
import { createPlanetsConfig } from "../config/planets.config";
import type { Planet } from "@/types/swapi";

/* =========================
   DASHBOARD
========================= */

export default function PlanetsDashboard() {
  const { data } = useSwapi("planets");

  const records = useMemo(
    () => ((data?.results ?? []) as Planet[]),
    [data]
  );

  const config = useMemo(
    () => createPlanetsConfig(records),
    [records]
  );

  return <UnifiedDashboard config={config} />;
}