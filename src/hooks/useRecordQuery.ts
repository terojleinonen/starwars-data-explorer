import { useMemo, useState } from "react";
import type { SwapiItem } from "@/components/types/swapi-types";

export type SortKey = "name" | "id";

function getLabel(item: SwapiItem): string {
  return (
    (item as any).name ??
    (item as any).title ??
    ""
  );
}

function getId(item: SwapiItem, fallback: number): number {
  const url = typeof item.url === "string" ? item.url : "";
  const id = Number(url.split("/").filter(Boolean).pop());
  return Number.isFinite(id) ? id : fallback;
}

export function useRecordQuery(items: SwapiItem[]) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");

  const results = useMemo(() => {
    let list = items;

    // SEARCH
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((item) =>
        getLabel(item).toLowerCase().includes(q)
      );
    }

    // SORT
    list = [...list].sort((a, b) => {
      if (sortKey === "name") {
        return getLabel(a).localeCompare(getLabel(b));
      }
      return getId(a, 0) - getId(b, 0);
    });

    return list;
  }, [items, query, sortKey]);

  return {
    query,
    setQuery,
    sortKey,
    setSortKey,
    results,
  };
}