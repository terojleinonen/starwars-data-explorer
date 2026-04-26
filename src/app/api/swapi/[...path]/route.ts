import { NextRequest, NextResponse } from "next/server";

type CacheEntry = {
  data: unknown;
  expiresAt: number;
};

const TTL_MS = 1000 * 60 * 10;
const RATE_WINDOW_MS = 1000 * 60;
const MAX_REQUESTS_PER_WINDOW = 60;

const cache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<unknown>>();

let windowStart = Date.now();
let requestCount = 0;

function normalizeWindow() {
  const now = Date.now();

  if (now - windowStart > RATE_WINDOW_MS) {
    windowStart = now;
    requestCount = 0;
  }
}

function rateLimited() {
  normalizeWindow();
  requestCount += 1;
  return requestCount > MAX_REQUESTS_PER_WINDOW;
}

async function fetchJson(url: string) {
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 600 },
  });

  if (!res.ok) {
    throw new Error(`Upstream failed: ${res.status}`);
  }

  return res.json();
}

async function fetchWithFallback(path: string) {
  const primary = `https://swapi.py4e.com/api/${path}`;
  const fallback = `https://swapi.dev/api/${path}`;

  try {
    return await fetchJson(primary);
  } catch {
    return fetchJson(fallback);
  }
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const joinedPath = path.join("/");

  if (!joinedPath) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  const key = joinedPath;
  const now = Date.now();

  const cached = cache.get(key);
  if (cached && cached.expiresAt > now) {
    return NextResponse.json(cached.data, {
      headers: {
        "X-Cache": "HIT",
      },
    });
  }

  if (rateLimited()) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429 }
    );
  }

  const existing = inflight.get(key);
  if (existing) {
    try {
      const data = await existing;
      return NextResponse.json(data, {
        headers: {
          "X-Cache": "DEDUPED",
        },
      });
    } catch {
      return NextResponse.json(
        { error: "Upstream fetch failed" },
        { status: 502 }
      );
    }
  }

  const promise = fetchWithFallback(joinedPath);

  inflight.set(key, promise);

  try {
    const data = await promise;

    cache.set(key, {
      data,
      expiresAt: now + TTL_MS,
    });

    return NextResponse.json(data, {
      headers: {
        "X-Cache": "MISS",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Upstream fetch failed" },
      { status: 502 }
    );
  } finally {
    inflight.delete(key);
  }
}