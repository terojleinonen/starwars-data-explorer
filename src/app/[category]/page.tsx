import { 
  PeopleDashboard, 
  PlanetsDashboard, 
  StarshipsDashboard, 
  FilmsTimelinePage,
  SpeciesDashboard,
  VehiclesDashboard } 
  from "@/features/pages";

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
      return <PeopleDashboard />;

    case "planets":
      return <PlanetsDashboard />;

    case "starships":
      return <StarshipsDashboard />;

    case "films":
      return <FilmsTimelinePage />;

    case "species":
      return <SpeciesDashboard />;

    case "vehicles":
      return <VehiclesDashboard />;

    default:
      return <div>Unknown category</div>;
  }
}