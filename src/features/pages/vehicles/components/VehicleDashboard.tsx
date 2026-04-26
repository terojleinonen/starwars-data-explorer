"use client";

import { useMemo } from "react";
import { useSwapi } from "@/hooks/data/useSwapi";

import UnifiedDashboard from "@/features/dashboard/components/UnifiedDashboard";
import { createVehiclesConfig } from "../config/vehicles.config";

type Vehicle = {
  name: string;
  model: string;
  manufacturer: string;
  vehicle_class: string;
  crew: string;
  passengers: string;
  cost_in_credits: string;
  max_atmosphering_speed: string;
  url: string;
};

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