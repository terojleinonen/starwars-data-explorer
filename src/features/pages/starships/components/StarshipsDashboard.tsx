"use client";

import { useMemo } from "react";
import { useSwapi } from "@/hooks/data/useSwapi";

import UnifiedDashboard from "@/features/dashboard/components/UnifiedDashboard";
import { createStarshipsConfig } from "../config/starships.config";
import { Starship } from "@/types/swapi";

/* =========================
   DASHBOARD
========================= */

export default function StarshipsDashboard() {
  const { data } = useSwapi("starships");

  const records = useMemo(
    () => ((data?.results ?? []) as Starship[]),
    [data]
  );

  const config = useMemo(
    () => createStarshipsConfig(records),
    [records]
  );

  return <UnifiedDashboard config={config} />;
}