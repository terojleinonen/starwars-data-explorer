import DetailsPage from "@/features/details/components/DetailsPage";
import { getSwapiItem } from "@/lib/swapi/swapi";
import type { SwapiType } from "@/lib/swapi/types";

type Props = {
  params: {
    category: SwapiType;
    id: string;
  };
};

export default async function Page({ params }: Props) {

  const { category, id } = params;
  const record = await getSwapiItem(category, id);

  return (
    <DetailsPage
      category={category}
      data={record}
    />
  );
}