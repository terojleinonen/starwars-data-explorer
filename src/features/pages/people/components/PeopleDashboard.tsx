"use client";

import { useMemo } from "react";
import { useSwapi } from "@/hooks/data/useSwapi";

import UnifiedDashboard from "@/features/dashboard/components/UnifiedDashboard";
import { createPeopleConfig } from "../config/people.config";

type Person = {
  name: string;
  height: string;
  mass: string;
  gender: string;
  birth_year: string;
  url: string;
};

export default function PeopleDashboard() {
  const { data } = useSwapi("people");

  const records = useMemo(
    () => ((data?.results ?? []) as Person[]),
    [data]
  );

  const config = useMemo(
    () => createPeopleConfig(records),
    [records]
  );

  return <UnifiedDashboard config={config} />;
}