export function parseArray(value: string | null) {
  if (!value) return [];
  return value.split(",").filter(Boolean);
}

export function toQueryString(params: Record<string, string | string[]>) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (!value || (Array.isArray(value) && !value.length)) return;

    query.set(
      key,
      Array.isArray(value) ? value.join(",") : value
    );
  });

  return query.toString();
}