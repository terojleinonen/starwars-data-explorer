import { SwapiItem } from "@/components/types/swapi-types";

export type RecordMeta = {
  id: string;
  title: string;
  subtitle?: string;
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