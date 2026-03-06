export type PlanetRecord = {
  name: string;
  x: number;
  y: number;
  size: number;
};

export const planets: PlanetRecord[] = [
  { name: "Tatooine", x: 420, y: 330, size: 90 },
  { name: "Corellia", x: 820, y: 250, size: 120 },
  { name: "Yavin", x: 1050, y: 520, size: 70 },
];

// ✅ O(1) lookup
export const planetByName: Record<string, PlanetRecord> = Object.fromEntries(
  planets.map((p) => [p.name, p])
);