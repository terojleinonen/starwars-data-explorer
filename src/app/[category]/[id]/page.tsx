import { DetailsPage } from "@/features/details";
import { getRecord } from "@/lib/swapi/swapiService";
import type { SwapiType } from "@/lib/swapi/swapiTypes";

type Props = {
  params: Promise<{
    category: SwapiType;
    id: string;
  }>;
};

export default async function Page({ params }: Props) {

  const { category, id } = await params;

  const record = await getRecord(category, id);

  return (
    <DetailsPage
      category={category}
      data={record}
    />
  );
}