export function paginate<T>(
  items: T[],
  page: number,
  perPage: number
) {
  const totalPages = Math.ceil(
    items.length / perPage
  );

  const start =
    (page - 1) * perPage;

  const end =
    start + perPage;

  return {
    items: items.slice(start, end),
    totalPages,
    currentPage: page,
  };
}