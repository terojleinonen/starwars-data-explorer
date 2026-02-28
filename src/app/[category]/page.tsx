import { CategoryPage } from "@/features/category/";
import { fetchCategoryList } from "@/lib/swapi/fetch";
import type { SwapiType, SwapiItem } from "@/lib/swapi/types";

type Props = {
  params: {
    category: SwapiType;
  };
};

export default async function Page({ params }: Props) {

  const { category } = params;

  const records = (await fetchCategoryList(category)) as SwapiItem[];

  const titles: Record<SwapiType, string> = {
    people: "People",
    planets: "Planets",
    films: "Films",
    starships: "Starships",
    species: "Species",
    vehicles: "Vehicles",
  };

  const subtitles: Record<SwapiType, string> = {
    people: "Sentient records of the galaxy",
    planets: "Planetary systems and worlds",
    films: "Holofilm archives",
    starships: "Interstellar vessels",
    species: "Biological classifications",
    vehicles: "Ground and atmospheric transport",
  };

  return (
    <CategoryPage
      category={category}
      title={titles[category]}
      subtitle={subtitles[category]}
      records={records}
    />
  );
}