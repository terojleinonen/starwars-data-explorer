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
  const res = await fetch(
    `${BASE_URL}/${category}/${id}/`,
    {
      cache: "no-store",
      headers: {
        Accept:
          "application/json,text/plain,*/*",
        "User-Agent":
          "Mozilla/5.0 (compatible; StarwarsExplorer/1.0)",
        Referer:
          "https://swapi.py4e.com/",
      },
    }
  );

  if (!res.ok) {
    throw new Error(
      `SWAPI ${res.status}`
    );
  }

  return res.json();
}