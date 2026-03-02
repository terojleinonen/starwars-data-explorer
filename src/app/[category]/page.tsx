import { CategoryPage } from "@/features/category";
import { getCategory } from "@/lib/swapi/swapiService";
import type { SwapiType } from "@/lib/swapi/swapiTypes";

type Props = {
  params: Promise<{
    category: SwapiType;
  }>;
};

export default async function Page({ params }: Props) {

  const { category } = await params;

  const records = await getCategory(category);

  return (
    <CategoryPage
      category={category}
      title={category}
      subtitle="Galactic archive records"
      records={records}
    />
  );
}