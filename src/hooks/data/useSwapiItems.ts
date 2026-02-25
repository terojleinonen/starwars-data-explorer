// FILE: src/components/useSwapiItem.ts
"use client";

import { useEffect, useState } from "react";

export type SwapiCategory =
  | "films"
  | "people"
  | "planets"
  | "species"
  | "vehicles"
  | "starships";

export interface SwapiItem {
  [key: string]: unknown;
}

const PRIMARY_API = "https://swapi.py4e.com/api";
const FALLBACK_API = "https://swapi.dev/api";

export function useSwapiItem<T extends SwapiItem>(
  category: SwapiCategory,
  id: string
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchItem(base: string) {
      const res = await fetch(`${base}/${category}/${id}/`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    }

    async function run() {
      try {
        const json = await fetchItem(PRIMARY_API);
        if (!cancelled) setData(json);
      } catch {
        try {
          const json = await fetchItem(FALLBACK_API);
          if (!cancelled) setData(json);
        } catch (e) {
          if (!cancelled) setError("Failed to load record");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [category, id]);

  return { data, loading, error };
}
