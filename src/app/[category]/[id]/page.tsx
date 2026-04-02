import DetailsPage from "@/features/details/components/DetailsPage";
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

  const data = await getRecord(category, id);

  return (
    <DetailsPage
      category={category}
      id={id}
      data={data}
    />
  );
}