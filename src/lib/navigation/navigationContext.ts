export type NavContext = {
  [key: string]: string;
};

const KEY = "galactic_nav_context";

export function setNavContext(category: string, path: string) {
  if (typeof window === "undefined") return;

  const existing = getNavContext();
  existing[category] = path;

  localStorage.setItem(KEY, JSON.stringify(existing));
}

export function getNavContext(): NavContext {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function getContextFor(category: string): string | null {
  const ctx = getNavContext();
  return ctx[category] || null;
}