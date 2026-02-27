import { cacheItem } from "./cache";

export function indexSwapiResults(
  category: string,
  results: any[]
) {
  results.forEach((item) => {
    cacheItem({
      id: item.url,
      label: item.name ?? item.title ?? "Unknown",
      category,
      url: item.url,
    });
  });
}