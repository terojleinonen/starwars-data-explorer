import type { SwapiType } from "@/components/types/swapi-types";

export type RecordMeta = {
  id: string;
  category: SwapiType;
  title: string;
  subtitle?: string;
};

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