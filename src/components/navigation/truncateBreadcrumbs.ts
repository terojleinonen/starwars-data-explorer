// src/navigation/truncateBreadcrumbs.ts

import type { BreadcrumbItem } from "./Breadcrumbs";

export function truncateBreadcrumbs(
  items: BreadcrumbItem[],
  visibleTail = 2
): BreadcrumbItem[] {
  if (items.length <= visibleTail + 1) {
    return items;
  }

  const head = items[0];
  const tail = items.slice(-visibleTail);

  return [
    head,
    { label: "…" },
    ...tail,
  ];
}