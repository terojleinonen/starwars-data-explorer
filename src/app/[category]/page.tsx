import {
  PeoplePage,
  PlanetsPage,
  StarshipsPage,
  FilmsPage,
  SpeciesPage,
  VehiclesPage,
} from "@/features/common/PageLayouts/pages";

import type { SwapiType } from "@/lib/swapi/swapiTypes";

type Props = {
  params: Promise<{
    category: SwapiType;
  }>;
};

export default async function Page({ params }: Props) {
  const { category } = await params;

  switch (category) {
    case "people":
      return <PeoplePage />;

    case "planets":
      return <PlanetsPage />;

    case "starships":
      return <StarshipsPage />;

    case "films":
      return <FilmsPage />;

    case "species":
      return <SpeciesPage />;

    case "vehicles":
      return <VehiclesPage />;

    default:
      return <div>Unknown category</div>;
  }
}