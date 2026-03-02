
export type IndexedItem = {
  id: string;
  label: string;
  category: string;
  url: string;
};

const indexCache = new Map<string, IndexedItem>();
const detailCache = new Map<string, any>(); // 🔥 new

export function cacheIndexItem(item: IndexedItem) {
  indexCache.set(item.url, item);
}

export function cacheDetail(url: string, data: any) {
  detailCache.set(url, data);
}

export function getCachedDetail(url: string) {
  return detailCache.get(url);
}

export function hasCachedDetail(url: string) {
  return detailCache.has(url);
}

export function getCachedIndexItems(): IndexedItem[] {
  return Array.from(indexCache.values());
}


const memoryCache = new Map<string, IndexedItem>();

export function cacheItem(item: IndexedItem) {
  memoryCache.set(item.url, item);

  // Persist between navigations
  sessionStorage.setItem(
    "swapi-index",
    JSON.stringify(Array.from(memoryCache.values()))
  );
}

export function getCachedItems(): IndexedItem[] {
  if (memoryCache.size === 0) {
    const stored = sessionStorage.getItem("swapi-index");
    if (stored) {
      JSON.parse(stored).forEach((item: IndexedItem) => {
        memoryCache.set(item.url, item);
      });
    }
  }

  return Array.from(memoryCache.values());
}

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