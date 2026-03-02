import type { RecordMeta } from "@/features/records";

export function normalizeRecord(item: any): RecordMeta {

  const urlParts = item.url.split("/").filter(Boolean);
  const id = String(urlParts[urlParts.length - 1]);

  return {
    id,

    title: item.title ?? item.name ?? "Unknown",

    subtitle:
      item.director ??
      item.model ??
      item.climate ??
      item.gender ??
      "",
  };
}