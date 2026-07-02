const BASE_URL = "https://swapi.info/api";

const cache = new Map<string, any[]>();

function extractId(url: string) {
  return url.match(/\/(\d+)\/?$/)?.[1] ?? "";
}

export async function getCategory(category: string) {
  if (cache.has(category)) {
    return cache.get(category)!;
  }

  const res = await fetch(
    `${BASE_URL}/${category}`,
    {
      next: {
        revalidate: 60 * 60 * 24,
      },
      headers: {
        Accept: "application/json",
        "User-Agent": "Galactic Archive",
      },
    }
  );

  if (!res.ok) {
    throw new Error(
      `SWAPI ${res.status} (${category})`
    );
  }

  const records = await res.json();

  if (!Array.isArray(records)) {
    throw new Error(
      `Expected array for "${category}"`
    );
  }

  cache.set(category, records);

  return records;
}

export async function getRecord(
  category: string,
  id: string
) {
  const records = await getCategory(category);

  const record = records.find(
    (r) => extractId(r.url) === id
  );

  if (!record) {
    throw new Error(
      `${category}/${id} not found`
    );
  }

  return record;
}