export function extractId(url: string): string {
  return url.match(/\/(\d+)\/?$/)?.[1] ?? "";
}

export function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b)
  );
}

export function splitCSV(value: string): string[] {
  return value.split(",").map((v) => v.trim()).filter(Boolean);
}

export function toNumber(value: string | undefined): number {
  if (!value || value === "unknown" || value === "n/a") return 0;
  const n = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function parseArray(value: string | null): string[] {
  return value ? value.split(",").filter(Boolean) : [];
}