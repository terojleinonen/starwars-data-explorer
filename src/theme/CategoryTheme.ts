import type { SwapiType } from "@/components/types/swapi-types";

export type CategoryTheme = {
  accentRgb: string; // "120, 180, 255"
};

export const CATEGORY_THEME: Record<SwapiType, CategoryTheme> = {
  people: {
    accentRgb: "120, 200, 255",
  },
  planets: {
    accentRgb: "90, 180, 170",
  },
  films: {
    accentRgb: "255, 200, 120",
  },
  starships: {
    accentRgb: "120, 160, 255",
  },
  vehicles: {
    accentRgb: "255, 170, 90",
  },
  species: {
    accentRgb: "140, 220, 160",
  },
};
