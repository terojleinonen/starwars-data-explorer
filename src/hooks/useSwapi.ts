// FILE: useSwapi.ts
// Fetch a single SWAPI item with automatic fallback to swapi.dev

import { useEffect, useState } from "react";
import { SwapiDataMap, SwapiType } from "../components/types/swapi-types";

const PY4E_BASE = "https://swapi.py4e.com/api";
const DEV_BASE = "https://swapi.dev/api";

// Helper: try fetch with graceful fallback
async function fetchWithFallback<T>(type: SwapiType, id: string): Promise<T> {
  const primaryUrl = `${PY4E_BASE}/${type}/${id}/`;
  const fallbackUrl = `${DEV_BASE}/${type}/${id}/`;

  console.log("Fetching (primary):", primaryUrl);

  try {
    const res = await fetch(primaryUrl);
    if (!res.ok) throw new Error("Primary failed");
    return (await res.json()) as T;
  } catch (err) {
    console.warn("Primary SWAPI endpoint failed, falling back to swapi.dev…");

    console.log("Fetching (fallback):", fallbackUrl);
    const res2 = await fetch(fallbackUrl);

    if (!res2.ok) {
      const msg = await res2.text();
      console.error("Fallback failed with response:", msg);
      throw new Error("Both SWAPI endpoints failed");
    }

    return (await res2.json()) as T;
  }
}

export function useSwapi<T extends SwapiType>(
  type: T,
  id: string | undefined
) {
  const [data, setData] = useState<SwapiDataMap[T] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(false);

    fetchWithFallback<SwapiDataMap[T]>(type, id)
      .then((result) => setData(result))
      .catch((err) => {
        console.error("SWAPI fetch error:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [type, id]);

  return { data, loading, error };
}
// FILE: useSwapi.ts