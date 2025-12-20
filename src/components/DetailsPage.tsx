// FILE: src/components/DetailsPage.tsx
// Strict, App Router–compatible SWAPI detail view

"use client";

import React from "react";
import { useSwapi } from "@/hooks/useSwapi";
import { isSwapiType, SwapiType } from "@/hooks/useSwapiTypes";

interface DetailsPageProps {
  theme: "light" | "dark";
  type: string; // raw route param
  id: string;
}

const safe = (v: unknown): string => {
  if (v === undefined || v === null) return "—";
  if (typeof v === "string" || typeof v === "number") return String(v);
  return "—";
};

const DetailsPage: React.FC<DetailsPageProps> = ({ theme, type, id }) => {
  // Validate and narrow category
  if (!isSwapiType(type)) {
    return (
      <div className="mx-auto max-w-3xl p-6 opacity-70">
        Unsupported category
      </div>
    );
  }

  const swapiType: SwapiType = type;

  const { data, loading, error } = useSwapi(swapiType, id);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl p-6 opacity-70">
        Loading record…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-red-400">
        Transmission error: {error ?? "Unknown error"}
      </div>
    );
  }

  const title =
    (data as any).name ??
    (data as any).title ??
    `Record ${id}`;

  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-10">
      <h1 className="mb-6 text-3xl font-semibold tracking-wide">
        {title}
      </h1>

      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(data).map(([key, value]) => {
          if (
            typeof value === "object" ||
            Array.isArray(value) ||
            key === "url"
          ) {
            return null;
          }

          return (
            <div
              key={key}
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <div className="mb-1 text-xs uppercase tracking-widest opacity-60">
                {key.replace(/_/g, " ")}
              </div>
              <div className="text-sm">{safe(value)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DetailsPage;