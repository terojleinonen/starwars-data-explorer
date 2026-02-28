export type SwapiCategory =
  | "films"
  | "people"
  | "planets"
  | "starships"
  | "vehicles"
  | "species";

const BASE_URL = "https://swapi.py4e.com/api";

export function swapiListUrl(category: SwapiCategory) {
  return `${BASE_URL}/${category}/`;
}

export function getIdFromSwapiUrl(url: string) {
  return url.split("/").filter(Boolean).pop()!;
}

export async function getSwapiItem(category: string, id: string) {

  const res = await fetch(
    `${BASE_URL}/${category}/${id}/`,
    { cache: "force-cache" }
  );

  if (!res.ok) {
    throw new Error("Failed to load SWAPI record");
  }

  return res.json();
}
