
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