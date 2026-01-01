import { swapiListUrl, SwapiCategory } from "./swapi";

export async function fetchCategoryList<T>(
  category: SwapiCategory
): Promise<T[]> {
  const res = await fetch(
    swapiListUrl(category),
    { next: { revalidate: 300 } }
  );

  if (!res.ok) {
    throw new Error("Failed to load category");
  }

  const data = await res.json();
  return data.results;
}