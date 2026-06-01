const BASE_URL = "https://swapi.py4e.com/api";

const cache = new Map<string, any>();

export async function getCategory(category: string) {

  const key = `category-${category}`;

  if (cache.has(key)) {
    return cache.get(key);
  }

  const allRecords: any[] = [];
  let nextUrl = `${BASE_URL}/${category}/`;

  try {
    while (nextUrl) {
      const res = await fetch(nextUrl, {
        next: { revalidate: 86400 },
      });

      if (!res.ok) {
        console.error("SWAPI fetch failed:", res.status);
        break;
      }

      const data = await res.json();
      allRecords.push(...(data.results ?? []));
      nextUrl = data.next; // Fetch next page if it exists
    }
  } catch (error) {
    console.error("SWAPI pagination error:", error);
  }

  cache.set(key, allRecords);

  return allRecords;
}

export async function getRecord(
  category: string,
  id: string
) {
  const url =
    `${BASE_URL}/${category}/${id}/`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  const text = await res.text();

  console.log(
    "SWAPI URL:",
    url
  );

  console.log(
    "SWAPI STATUS:",
    res.status
  );

  console.log(
    "SWAPI RESPONSE:",
    text.slice(0, 300)
  );

  if (!res.ok) {
    throw new Error(
      `SWAPI ${res.status}`
    );
  }

  return JSON.parse(text);
}