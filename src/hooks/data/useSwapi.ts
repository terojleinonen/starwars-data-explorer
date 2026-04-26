"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/* =========================
   TYPES
========================= */

export type SwapiResponse<T> = {
  count: number;
  results: T[];
  next: string | null;
  previous: string | null;
};

type UseSwapiResult<T> = {
  data: SwapiResponse<T> | null;
  loading: boolean;
  error: string | null;
};

/* =========================
   GLOBAL CACHE + DEDUPE
========================= */

const cache = new Map<string, unknown>();
const inflight = new Map<string, Promise<unknown>>();

/* =========================
   HOOK
========================= */

export function useSwapi<T>(category: string): UseSwapiResult<T> {
  const [data, setData] = useState<SwapiResponse<T> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef(true);

  const url = useMemo(() => `/api/swapi/${category}`, [category]);

  useEffect(() => {
    mountedRef.current = true;

    async function load() {
      setLoading(true);
      setError(null);

      /* ===== CACHE HIT ===== */
      if (cache.has(url)) {
        if (mountedRef.current) {
          setData(cache.get(url) as SwapiResponse<T>);
          setLoading(false);
        }
        return;
      }

      /* ===== INFLIGHT DEDUPE ===== */
      const existing = inflight.get(url);
      if (existing) {
        try {
          const result = await existing;

          if (mountedRef.current) {
            setData(result as SwapiResponse<T>);
            setLoading(false);
          }

          return;
        } catch (err) {
          if (mountedRef.current) {
            setError(
              err instanceof Error ? err.message : "Unknown error"
            );
            setLoading(false);
          }
          return;
        }
      }

      /* ===== NEW REQUEST ===== */
      const request = fetch(url)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Request failed: ${res.status}`);
          }
          return res.json();
        })
        .then((json) => {
          cache.set(url, json);
          return json;
        })
        .finally(() => {
          inflight.delete(url);
        });

      inflight.set(url, request);

      try {
        const result = await request;

        if (mountedRef.current) {
          setData(result as SwapiResponse<T>);
        }
      } catch (err) {
        if (mountedRef.current) {
          setError(
            err instanceof Error ? err.message : "Unknown error"
          );
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mountedRef.current = false;
    };
  }, [url]);

  return { data, loading, error };
}