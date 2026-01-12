import DetailsPage from "@/components/details/DetailsPage";
import type { SwapiType } from "@/components/types/swapi-types";

type PageProps = {
  params: Promise<{
    category: SwapiType;
    id: string;
  }>;
};

export default async function Page({
  params,
}: PageProps) {
  const { category, id } = await params;

  const res = await fetch(
    `https://swapi.py4e.com/api/${category}/${id}/`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to load data");
  }

  const data = await res.json();

  return (
    <DetailsPage
    category={category}
    data={data}
    />
  );
}