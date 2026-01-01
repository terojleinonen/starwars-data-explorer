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
