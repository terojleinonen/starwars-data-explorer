import { NextRequest, NextResponse } from "next/server";

type CacheEntry = {
  data: unknown;
  expiresAt: number;
};

const SWAPI_BASE =
  "https://swapi.py4e.com/api";

const CACHE_TTL =
  1000 * 60 * 60 * 6; // 6h

const cache = new Map<
  string,
  CacheEntry
>();

const inflight = new Map<
  string,
  Promise<unknown>
>();

async function fetchJson(url: string) {
  const res = await fetch(url, {
    next: { revalidate: 21600 },
    headers: {
      Accept: "application/json,text/plain,*/*",
      "User-Agent":
        "Mozilla/5.0 (compatible; StarwarsExplorer/1.0; +https://vercel.app)",
      Referer: "https://swapi.py4e.com/",
    },
  });

  if (!res.ok) {
    throw new Error(`SWAPI ${res.status}: ${url}`);
  }

  return res.json();
}

async function fetchCategory(
  category: string
) {
  let nextUrl =
    `${SWAPI_BASE}/${category}/`;

  const results: unknown[] = [];

  while (nextUrl) {
    const page = await fetchJson(
      nextUrl
    );

    results.push(
      ...(page.results ?? [])
    );

    nextUrl = page.next;
  }

  return {
    count: results.length,
    results,
    next: null,
    previous: null,
  };
}

async function fetchRecord(
  category: string,
  id: string
) {
  return fetchJson(
    `${SWAPI_BASE}/${category}/${id}/`
  );
}

export async function GET(
  _req: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  }
) {
  try {
    const { path } =
      await context.params;

    if (
      !path ||
      path.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Missing route path",
        },
        {
          status: 400,
        }
      );
    }

    const key = path.join("/");

    const now = Date.now();

    const cached =
      cache.get(key);

    if (
      cached &&
      cached.expiresAt > now
    ) {
      return NextResponse.json(
        cached.data,
        {
          headers: {
            "X-Cache": "HIT",
          },
        }
      );
    }

    const existing =
      inflight.get(key);

    if (existing) {
      const data =
        await existing;

      return NextResponse.json(
        data,
        {
          headers: {
            "X-Cache":
              "DEDUPED",
          },
        }
      );
    }

    const promise =
      path.length === 1
        ? fetchCategory(
            path[0]
          )
        : fetchRecord(
            path[0],
            path[1]
          );

    inflight.set(
      key,
      promise
    );

    const data =
      await promise;

    cache.set(key, {
      data,
      expiresAt:
        now + CACHE_TTL,
    });

    return NextResponse.json(
      data,
      {
        headers: {
          "X-Cache": "MISS",
        },
      }
    );
  } catch (error) {
    console.error(
      "SWAPI API route failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Upstream fetch failed",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 502,
      }
    );
  } finally {
    const { path } =
      await context.params;

    inflight.delete(
      path.join("/")
    );
  }
}