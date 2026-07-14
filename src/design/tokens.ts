export type ThemeMode = "dark" | "light";

export type CategoryKey =
  | "people"
  | "planets"
  | "films"
  | "starships"
  | "vehicles"
  | "species";

export const CATEGORY_ACCENTS: Record<CategoryKey, `--accent-${CategoryKey}`> = {
  people: "--accent-people",
  planets: "--accent-planets",
  films: "--accent-films",
  starships: "--accent-starships",
  vehicles: "--accent-vehicles",
  species: "--accent-species",
};

export const DESIGN_TOKENS = {
  surface: {
    canvas: "--surface-canvas",
    subtle: "--surface-subtle",
    raised: "--surface-raised",
    overlay: "--surface-overlay",
  },
  text: {
    primary: "--text-primary",
    secondary: "--text-secondary",
    muted: "--text-muted",
    faint: "--text-faint",
  },
  border: {
    subtle: "--border-subtle",
    default: "--border-default",
    strong: "--border-strong",
  },
  accent: {
    primary: "--accent-primary",
    secondary: "--accent-secondary",
  },
} as const;

export function getCategoryAccentVar(category: CategoryKey = "people") {
  return `var(${CATEGORY_ACCENTS[category]})`;
}

export function categoryAccentStyle(category: CategoryKey) {
  return { "--category-accent": getCategoryAccentVar(category) } as React.CSSProperties;
}
