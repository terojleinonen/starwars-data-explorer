export function extractId(url: string): string {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? match[1] : "";
}

export async function fetchRelated(urls: string[]) {
  try {
    const results = await Promise.all(
      urls.map(async (url) => {
        try {
          const res = await fetch(url);
          
          // Check for successful response before parsing JSON
          if (!res.ok) {
            return null;
          }

          const json = await res.json();

          return {
            id: extractId(url),
            label: json.name || json.title || "Unknown",
            url,
          };
        } catch {
          return null;
        }
      })
    );

    return results.filter(Boolean);
  } catch {
    return [];
  }
}