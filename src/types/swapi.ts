export type Planet = {
  name: string;
  climate: string;
  terrain: string;
  population: string;
  diameter: string;
  rotation_period: string;
  orbital_period: string;

  gravity: string; // ✅ ADD THIS
  surface_water?: string;
  residents?: string[];

  url: string;
};

export type Person = {
  name: string;
  gender: string;
  birth_year: string;
  height: string;
  mass: string;
  url: string;
};

export type Species = {
  name: string;
  classification: string;
  designation: string;
  average_height: string;
  average_lifespan: string;
  language: string;
  url: string;
};

export type Starship = {
  name: string;
  model: string;
  manufacturer: string;
  starship_class: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  max_atmosphering_speed: string;
  hyperdrive_rating: string;
  MGLT: string;
  cost_in_credits: string;
  url: string;
};

export type Vehicle = {
  name: string;
  model: string;
  manufacturer: string;
  vehicle_class: string;
  crew: string;
  passengers: string;
  cost_in_credits: string;
  max_atmosphering_speed: string;
  url: string;
};