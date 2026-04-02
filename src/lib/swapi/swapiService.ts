const BASE_URL = "https://swapi.py4e.com/api";

const cache = new Map<string, any>();

export async function getCategory(category: string) {

  const key = `category-${category}`;

  if (cache.has(key)) {
    return cache.get(key);
  }

  const res = await fetch(`${BASE_URL}/${category}/`, {
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    console.error("SWAPI fetch failed:", res.status);
    return [];
  }

  const data = await res.json();

  const records = data.results ?? [];

  cache.set(key, records);

  return records;
}

export async function prefetchCategory(category: string) {

  const key = `category-${category}`;

  if (cache.has(key)) return;

  try {

    const res = await fetch(`${BASE_URL}/${category}/`);

    if (!res.ok) return;

    const data = await res.json();

    cache.set(key, data.results ?? []);

  } catch (err) {

    console.warn("SWAPI prefetch failed", err);

  }

}

export async function getRecord(category: string, id: string) {
  try {
    const res = await fetch(
      `${BASE_URL}/${category}/${id}/`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("py4e failed");

    return res.json();
  } catch {
    const res = await fetch(
      `${BASE_URL}/${category}/${id}/`
    );

    return res.json();
  }
}