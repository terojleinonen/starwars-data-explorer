// src/design/tokens.ts

export type ThemeMode = "dark" | "light";

export type CategoryKey =
  | "people"
  | "planets"
  | "films"
  | "starships"
  | "vehicles"
  | "species";

/* -----------------------------------------
   Category → Accent token mapping
----------------------------------------- */

export const CATEGORY_ACCENTS: Record<CategoryKey, string> = {
  people: "people",
  planets: "planets",
  films: "films",
  starships: "starships",
  vehicles: "vehicles",
  species: "species",
};

/* -----------------------------------------
   Helper
----------------------------------------- */

export function getCategoryAccentVar(category?: CategoryKey) {
  return `var(--accent-${category ?? "people"})`;
}