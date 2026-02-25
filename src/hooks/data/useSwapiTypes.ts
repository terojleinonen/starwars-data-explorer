export const SWAPI_TYPES = [
  "films",
  "people",
  "planets",
  "species",
  "vehicles",
  "starships",
] as const;

export type SwapiType = (typeof SWAPI_TYPES)[number];

export function isSwapiType(value: string): value is SwapiType {
  return (SWAPI_TYPES as readonly string[]).includes(value);
}