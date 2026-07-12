import { NextRequest, NextResponse } from "next/server";

type CacheEntry = {
  data: unknown;
  expiresAt: number;
};

const SWAPI_BASE = "https://swapi.info/api"; // Change if your verified endpoint differs

const CACHE_TTL = 1000 * 60 * 60 * 6; // 6 hours

const cache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<unknown>>();

async function fetchJson(url: string) {
  const res = await fetch(url, {
    next: {
      revalidate: 21600,
    },
    headers: {
      Accept: "application/json",
      "User-Agent":
        "Mozilla/5.0 (compatible; StarwarsExplorer/1.0)",
    },
  });

  if (!res.ok) {
    throw new Error(`SWAPI ${res.status}: ${url}`);
  }

  return res.json();
}

async function fetchCategory(category: string) {
  const records = await fetchJson(
    `${SWAPI_BASE}/${category}`
  );

  if (!Array.isArray(records)) {
    throw new Error(
      `Expected array from ${category}`
    );
  }

  console.log(
    `Fetched ${records.length} ${category}`
  );

  return {
    count: records.length,
    results: records,
    next: null,
    previous: null,
  };
}

function extractId(url: string) {
  return url.match(/\/(\d+)\/?$/)?.[1] ?? "";
}

async function fetchRecord(
  category: string,
  id: string
) {
  const categoryData =
    await fetchCategory(category);

  const record =
    categoryData.results.find(
      (item: any) =>
        extractId(item.url) === id
    );

  if (!record) {
    throw new Error(
      `Record ${category}/${id} not found`
    );
  }

  return record;
}

export async function GET(
  _req: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  }
) {
  const { path } = await context.params;

  if (!path?.length) {
    return NextResponse.json(
      {
        error: "Missing route path",
      },
      {
        status: 400,
      }
    );
  }

  const key = path.join("/");
  const category = path[0];

  const categoryCache =
    cache.get(category);

  if (
    path.length === 2 &&
    categoryCache
  ) {
    const record =
      (
        categoryCache.data as any
      ).results.find(
        (r: any) =>
          extractId(r.url) === path[1]
      );

    if (record) {
      return NextResponse.json(
        record,
        {
          headers: {
            "X-Cache":
              "CATEGORY-HIT",
          },
        }
      );
    }
  }

  const pending =
    inflight.get(key);

  if (pending) {
    const data = await pending;

    return NextResponse.json(
      data,
      {
        headers: {
          "X-Cache": "DEDUPED",
        },
      }
    );
  }

  let promise: Promise<any>;

  if (path.length === 1) {
    promise = fetchCategory(path[0]);
  } else {
    promise = fetchRecord(
      path[0],
      path[1]
    );
  }
  inflight.set(key, promise);

  try {
    const data =
      await promise;

    cache.set(key, {
      data,
      expiresAt:
        Date.now() + CACHE_TTL,
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
    inflight.delete(key);
  }
}