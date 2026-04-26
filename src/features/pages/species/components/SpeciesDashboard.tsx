"use client";

import { useMemo } from "react";
import { useSwapi } from "@/hooks/data/useSwapi";

import UnifiedDashboard from "@/features/dashboard/components/UnifiedDashboard";
import { createSpeciesConfig } from "../config/species.config";

type Species = {
  name: string;
  classification: string;
  designation: string;
  average_height: string;
  average_lifespan: string;
  language: string;
  url: string;
};

export default function SpeciesDashboard() {
  const { data } = useSwapi("species");

  const records = useMemo(
    () => ((data?.results ?? []) as Species[]),
    [data]
  );

  const config = useMemo(
    () => createSpeciesConfig(records),
    [records]
  );

  return <UnifiedDashboard config={config} />;
}