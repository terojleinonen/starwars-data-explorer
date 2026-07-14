export type Datum = { label: string; value: number };
export type Point = { label: string; x: number; y: number };

const UNKNOWN = new Set(["", "unknown", "n/a", "none", "null", "undefined"]);

export function numberValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/,/g, "").trim().toLowerCase();
  if (UNKNOWN.has(cleaned)) return null;
  const match = cleaned.match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

export function textValue(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  return UNKNOWN.has(cleaned.toLowerCase()) ? null : cleaned;
}

export function categoricalDistribution<T>(records: T[], accessor: (record: T) => unknown, limit = 8): Datum[] {
  const counts = new Map<string, number>();
  records.forEach((record) => {
    const raw = textValue(accessor(record));
    if (!raw) return;
    raw.split(",").map((part) => part.trim()).filter(Boolean).forEach((part) => counts.set(part, (counts.get(part) ?? 0) + 1));
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([label, value]) => ({ label, value }));
}

export function rankedNumeric<T>(records: T[], label: (record: T) => string, accessor: (record: T) => unknown, limit = 8): Datum[] {
  return records.map((record) => ({ label: label(record), value: numberValue(accessor(record)) }))
    .filter((item): item is Datum => item.value !== null && item.value > 0)
    .sort((a, b) => b.value - a.value).slice(0, limit);
}

export function scatterNumeric<T>(records: T[], label: (record: T) => string, x: (record: T) => unknown, y: (record: T) => unknown, limit = 60): Point[] {
  return records.map((record) => ({ label: label(record), x: numberValue(x(record)), y: numberValue(y(record)) }))
    .filter((item): item is Point => item.x !== null && item.y !== null && item.x > 0 && item.y > 0).slice(0, limit);
}

export function completeness(records: unknown[]): Datum[] {
  if (!records.length) return [];
  const keys = new Set<string>();
  records.forEach((record) => { if (record && typeof record === "object") Object.keys(record as object).forEach((key) => keys.add(key)); });
  return [...keys].filter((key) => !["url", "created", "edited"].includes(key)).map((key) => {
    const known = records.filter((record) => record && typeof record === "object" && (textValue((record as Record<string, unknown>)[key]) !== null || numberValue((record as Record<string, unknown>)[key]) !== null || Array.isArray((record as Record<string, unknown>)[key]))).length;
    return { label: key.replaceAll("_", " "), value: Math.round((known / records.length) * 100) };
  }).sort((a, b) => b.value - a.value).slice(0, 10);
}

export function categoryVisualizations(category: string, records: unknown[]) {
  const r = records as Record<string, unknown>[];
  const name = (item: Record<string, unknown>) => String(item.name ?? item.title ?? "Record");
  switch (category) {
    case "people": return {
      distribution: categoricalDistribution(r, (x) => x.gender), distributionTitle: "Gender profile",
      ranking: rankedNumeric(r, name, (x) => x.height), rankingTitle: "Tallest known individuals", rankingUnit: "cm",
      scatter: scatterNumeric(r, name, (x) => x.height, (x) => x.mass), scatterTitle: "Height and mass", xLabel: "Height", yLabel: "Mass",
    };
    case "planets": return {
      distribution: categoricalDistribution(r, (x) => x.climate), distributionTitle: "Climate frequency",
      ranking: rankedNumeric(r, name, (x) => x.population), rankingTitle: "Largest known populations", rankingUnit: "",
      scatter: scatterNumeric(r, name, (x) => x.rotation_period, (x) => x.orbital_period), scatterTitle: "Rotation and orbital periods", xLabel: "Rotation", yLabel: "Orbit",
    };
    case "species": return {
      distribution: categoricalDistribution(r, (x) => x.classification), distributionTitle: "Classification profile",
      ranking: rankedNumeric(r, name, (x) => x.average_lifespan), rankingTitle: "Longest known lifespans", rankingUnit: "years",
      scatter: scatterNumeric(r, name, (x) => x.average_height, (x) => x.average_lifespan), scatterTitle: "Height and lifespan", xLabel: "Height", yLabel: "Lifespan",
    };
    case "starships": return {
      distribution: categoricalDistribution(r, (x) => x.starship_class), distributionTitle: "Starship classes",
      ranking: rankedNumeric(r, name, (x) => x.cost_in_credits), rankingTitle: "Highest acquisition cost", rankingUnit: "credits",
      scatter: scatterNumeric(r, name, (x) => x.length, (x) => x.crew), scatterTitle: "Length and crew", xLabel: "Length", yLabel: "Crew",
    };
    case "vehicles": return {
      distribution: categoricalDistribution(r, (x) => x.vehicle_class), distributionTitle: "Vehicle classes",
      ranking: rankedNumeric(r, name, (x) => x.max_atmosphering_speed), rankingTitle: "Fastest vehicles", rankingUnit: "",
      scatter: scatterNumeric(r, name, (x) => x.cost_in_credits, (x) => x.max_atmosphering_speed), scatterTitle: "Cost and speed", xLabel: "Cost", yLabel: "Speed",
    };
    default: return {
      distribution: [], distributionTitle: "Archive profile", ranking: [], rankingTitle: "Ranked records", rankingUnit: "", scatter: [], scatterTitle: "Numeric relationship", xLabel: "X", yLabel: "Y",
    };
  }
}
