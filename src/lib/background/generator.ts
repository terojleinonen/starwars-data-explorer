export type ArchiveCategory =
  | "home"
  | "people"
  | "planets"
  | "films"
  | "starships"
  | "vehicles"
  | "species"
  | "detail";

export type StarPoint = {
  x: number;
  y: number;
  radius: number;
  opacity: number;
};

export type DustPoint = {
  x: number;
  y: number;
  radius: number;
  delay: number;
  duration: number;
};

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function random(seed: number) {
  let state = seed || 1;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateStars(category: ArchiveCategory, count = 92): StarPoint[] {
  const next = random(hash(`galactic-archive:${category}:stars`));
  return Array.from({ length: count }, () => ({
    x: next() * 100,
    y: next() * 100,
    radius: 0.35 + Math.pow(next(), 2.8) * 1.45,
    opacity: 0.18 + next() * 0.62,
  }));
}

export function generateDust(category: ArchiveCategory, count = 11): DustPoint[] {
  const next = random(hash(`galactic-archive:${category}:dust`));
  return Array.from({ length: count }, () => ({
    x: next() * 100,
    y: next() * 100,
    radius: 1 + next() * 2.2,
    delay: -(next() * 40),
    duration: 32 + next() * 36,
  }));
}

export function categoryFromPath(pathname: string): ArchiveCategory {
  const segments = pathname.split("/").filter(Boolean);
  const category = segments[0];

  if (segments.length > 1) return "detail";
  if (
    category === "people" ||
    category === "planets" ||
    category === "films" ||
    category === "starships" ||
    category === "vehicles" ||
    category === "species"
  ) {
    return category;
  }

  return "home";
}
