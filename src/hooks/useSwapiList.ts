// FILE: useSwapiList.ts
// Fetch category list with fallback to swapi.dev

import { useEffect, useState } from "react";
import { SwapiDataMap, SwapiType } from "../components/types/swapi-types";

const PY4E_BASE = "https://swapi.py4e.com/api";
const DEV_BASE = "https://swapi.dev/api";

async function fetchListWithFallback<T>(type: SwapiType): Promise<T[]> {
  const primaryUrl = `${PY4E_BASE}/${type}/`;
  const fallbackUrl = `${DEV_BASE}/${type}/`;

  console.log("Fetching list (primary):", primaryUrl);

  try {
    const res = await fetch(primaryUrl);
    if (!res.ok) throw new Error("Primary failed");
    const json = await res.json();
    return json.results as T[];
  } catch (err) {
    console.warn("Primary list failed, falling back to swapi.dev…");

    const res2 = await fetch(fallbackUrl);
    if (!res2.ok) throw new Error("Fallback list failed");

    const json2 = await res2.json();
    return json2.results as T[];
  }
}

export function useSwapiList<T extends SwapiType>(type: T) {
  const [data, setData] = useState<SwapiDataMap[T][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);

    fetchListWithFallback<SwapiDataMap[T]>(type)
      .then((list) => setData(list))
      .catch((err) => {
        console.error("SWAPI list fetch error:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [type]);

  return { data, loading, error };
}
// FILE: useSwapiList.ts