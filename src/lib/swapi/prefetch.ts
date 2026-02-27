import {
  cacheDetail,
  hasCachedDetail,
} from "./cache";

export async function prefetchSwapiDetail(url?: string) {
  if (!url) return;
  if (hasCachedDetail(url)) return;

  try {
    const res = await fetch(url, {
      priority: "low", // browser hint
    });
    if (!res.ok) return;

    const data = await res.json();
    cacheDetail(url, data);
  } catch {
    // silent fail — prefetch must never break UX
  }
}