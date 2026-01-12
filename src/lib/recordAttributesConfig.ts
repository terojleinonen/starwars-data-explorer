import type { SwapiType } from "@/components/types/swapi-types";

export type StatDef = {
  key: string;
  label: string;
  unit?: string;
};

export const RECORD_PRIMARY_STATS: Record<SwapiType, StatDef[]> = {
  films: [
    { key: "episode_id", label: "Episode" },
    { key: "director", label: "Director" },
    { key: "producer", label: "Producer" },
    { key: "release_date", label: "Release" },
  ],

  people: [
    { key: "height", label: "Height", unit: "cm" },
    { key: "mass", label: "Mass", unit: "kg" },
    { key: "gender", label: "Gender" },
    { key: "birth_year", label: "Born" },
    { key: "eye_color", label: "Eyes" },
    { key: "hair_color", label: "Hair" },
  ],

  planets: [
    { key: "rotation_period", label: "Rotation", unit: "h" },
    { key: "orbital_period", label: "Orbit", unit: "d" },
    { key: "diameter", label: "Diameter", unit: "km" },
    { key: "climate", label: "Climate" },
    { key: "terrain", label: "Terrain" },
    { key: "population", label: "Population" },
  ],

  starships: [
    { key: "model", label: "Model" },
    { key: "manufacturer", label: "Builder" },
    { key: "crew", label: "Crew" },
    { key: "passengers", label: "Passengers" },
    { key: "hyperdrive_rating", label: "Hyperdrive" },
    { key: "starship_class", label: "Class" },
  ],

  vehicles: [
    { key: "model", label: "Model" },
    { key: "manufacturer", label: "Builder" },
    { key: "crew", label: "Crew" },
    { key: "passengers", label: "Passengers" },
    { key: "vehicle_class", label: "Class" },
    { key: "max_atmosphering_speed", label: "Max Speed" },
  ],

  species: [
    { key: "classification", label: "Class" },
    { key: "designation", label: "Designation" },
    { key: "language", label: "Language" },
    { key: "average_height", label: "Height", unit: "cm" },
    { key: "average_lifespan", label: "Lifespan", unit: "y" },
    { key: "skin_colors", label: "Skin" },
  ],
};