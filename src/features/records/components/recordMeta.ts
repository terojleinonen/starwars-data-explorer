import { SwapiItem, SwapiType } from "@/lib/swapi/types";

export type RecordMeta = {
  id: string;
  title: string;
  subtitle?: string;
  category?: SwapiType;
};

const safe = (v: unknown): string => {
  if (v === undefined || v === null) return "—";
  if (typeof v === "string" || typeof v === "number") return String(v);
  return "—";
};

export function getRecordMeta(
  item: SwapiItem,
  fallbackId: string
): RecordMeta {
  const url =
    typeof item.url === "string"
      ? item.url
      : "";

  const id =
    url.split("/").filter(Boolean).pop() ??
    fallbackId;

  return {
    id,
    title:
      (item as any).name ??
      (item as any).title ??
      "Unknown",
    subtitle:
      safe(
        item.model ??
          item.classification ??
          item.director ??
          item.climate ??
          item.gender ??
          item.starship_class
      ) || undefined,
  };
}

export function getRecordMetaFromItem(
  item: any,
  category: SwapiType,
  fallbackId: string
): RecordMeta {
  const url =
    typeof item?.url === "string"
      ? item.url
      : "";

  const id =
    url.split("/").filter(Boolean).pop() ??
    fallbackId;

  return {
    id,
    category,
    title:
      item?.name ??
      item?.title ??
      "Unknown record",
    subtitle:
      item?.director ??
      item?.model ??
      item?.classification ??
      item?.climate ??
      item?.gender ??
      item?.starship_class ??
      undefined,
  };
}