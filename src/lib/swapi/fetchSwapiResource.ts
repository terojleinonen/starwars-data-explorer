const resourceCache = new Map<string, unknown>();
const inflight = new Map<string, Promise<unknown>>();

export async function fetchSwapiResource<T>(url: string): Promise<T> {
  const proxyUrl = url
    .replace("https://swapi.py4e.com/api/", "/api/swapi/")
    .replace("https://swapi.dev/api/", "/api/swapi/");

  if (resourceCache.has(proxyUrl)) {
    return resourceCache.get(proxyUrl) as T;
  }

  const existing = inflight.get(proxyUrl);
  if (existing) {
    return existing as Promise<T>;
  }

  const promise = fetch(proxyUrl)
    .then((res) => {
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      return res.json();
    })
    .then((json) => {
      resourceCache.set(proxyUrl, json);
      return json;
    })
    .finally(() => {
      inflight.delete(proxyUrl);
    });

  inflight.set(proxyUrl, promise);

  return promise as Promise<T>;
}