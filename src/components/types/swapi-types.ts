/* ============================================
   SWAPI Core Types
   Authoritative shared typing for the app
============================================ */

/* --------------------------------------------
   Category union
-------------------------------------------- */

export type SwapiType =
  | "films"
  | "people"
  | "planets"
  | "species"
  | "vehicles"
  | "starships";

/* --------------------------------------------
   Base record (shared by all SWAPI entities)
-------------------------------------------- */

export interface SwapiItem {
  url: string;
  created?: string;
  edited?: string;
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
  [key: string]: unknown;
}

/* --------------------------------------------
   Generic SWAPI item
   (intentionally loose – SWAPI is inconsistent)
-------------------------------------------- */

// SwapiItem is now the primary interface.
// The old SwapiItem and SwapiBase are replaced.

/* --------------------------------------------
   List response
-------------------------------------------- */

export interface SwapiListResponse<T = SwapiItem> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/* --------------------------------------------
   Record metadata (UI-level abstraction)
-------------------------------------------- */

export type RecordMeta = {
  id: string;
  title: string;
  subtitle?: string;
  category: SwapiType;
};

/* --------------------------------------------
   Helpers (shared logic, safe defaults)
-------------------------------------------- */

/**
 * Extract numeric ID from SWAPI URL
 */
export function getIdFromUrl(
  url: string,
  fallback = "—"
): string {
  const match = url.match(/\/(\d+)\/?$/);
  return match?.[1] ?? fallback;
}

/**
 * Resolve primary display label
 */
export function getRecordTitle(
  item: SwapiItem
): string {
  return (
    item.name ??
    item.title ??
    "Unknown"
  );
}