type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

const CACHE = new Map<string, CacheEntry<any>>();
const TTL = 1000 * 60 * 5; // 5 minutes

export async function cachedFetch<T>(url: string): Promise<T> {
  const now = Date.now();
  const cached = CACHE.get(url);

  if (cached && now - cached.timestamp < TTL) {
    return cached.data;
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}`);
  }

  const data = (await res.json()) as T;
  CACHE.set(url, { data, timestamp: now });
  return data;
}

export function prefetch(url: string) {
  if (CACHE.has(url)) return;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      CACHE.set(url, { data, timestamp: Date.now() });
    })
    .catch(() => {
      /* silent */
    });
}