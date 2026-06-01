"use client";

import { useMemo } from "react";
import { useSwapi } from "@/hooks/data/useSwapi";

import UnifiedDashboard from "@/features/dashboard/components/UnifiedDashboard";
import { createVehiclesConfig } from "../config/vehicles.config";
import { Vehicle } from "@/types/swapi";

export default function VehiclesDashboard() {
  const { data } = useSwapi("vehicles");

  const records = useMemo(
    () => ((data?.results ?? []) as Vehicle[]),
    [data]
  );

  const config = useMemo(
    () => createVehiclesConfig(records),
    [records]
  );

  return <UnifiedDashboard config={config} />;
}