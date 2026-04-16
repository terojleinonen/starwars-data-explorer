// FILE: useSwapi.ts
// Strict TypeScript SWAPI fetcher with caching, loading, error states.

import { useEffect, useState } from "react";
import type { SwapiItem } from "@/lib/swapi/swapiTypes";

// ----- Strict SWAPI types -----
export interface SwapiListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Generic SWAPI item type
export type SwapiData = Record<string, any>;

// Hook return structure
export interface UseSwapiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// ----- Simple in-memory cache -----
const swapiCache = new Map<string, unknown>();

// Base URL for SWAPI
const BASE_URL = "https://swapi.py4e.com/api";

export function useSwapi<T extends SwapiData>(endpoint: string): UseSwapiResult<T> {
  const url = `${BASE_URL}/${endpoint}`;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // use cached response if available
      if (swapiCache.has(url)) {
        setData(swapiCache.get(url) as T);
        setLoading(false);
        return;
      }

      // Fetch all pages by following pagination chain
      const allResults: any[] = [];
      let nextUrl: string | null = url;

      while (nextUrl) {
        const response = await fetch(nextUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const json = (await response.json()) as any;
        allResults.push(...(json.results ?? []));
        nextUrl = json.next; // Follow pagination to next page
      }

      // Create response object with all results
      const completeData = {
        count: allResults.length,
        results: allResults,
        next: null,
        previous: null,
      } as unknown as T;

      swapiCache.set(url, completeData);
      setData(completeData);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  return { data, loading, error, refetch: fetchData };
}
