// FILE: useSwapi.ts
// Strict TypeScript SWAPI fetcher with caching, loading, error states.

import { useEffect, useState } from "react";

// ----- Strict SWAPI types -----
export interface SwapiListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Generic SWAPI item type
export type SwapiData = Record<string, any>;

// Represents a single item from the SWAPI, with all possible fields from various categories.
export interface SwapiItem {
  url: string;
  name?: string;
  title?: string;
  model?: string;
  classification?: string;
  director?: string;
  climate?: string;
  gender?: string;
  starship_class?: string;
  height?: string;
  mass?: string;
  gravity?: string;
  orbital_period?: string;
  language?: string;
  average_lifespan?: string;
  max_atmosphering_speed?: string;
  crew?: string;
  hyperdrive_rating?: string;
  release_date?: string;
  episode_id?: number;
}

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
const BASE_URL = "https://swapi.dev/api";

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

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = (await response.json()) as T;

      swapiCache.set(url, json);
      setData(json);
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
