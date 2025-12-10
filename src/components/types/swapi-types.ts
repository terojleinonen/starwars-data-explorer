// FILE: swapi-types.ts
// Strict TypeScript interfaces for all SWAPI categories.

export type SwapiType =
  | "films"
  | "people"
  | "planets"
  | "species"
  | "vehicles"
  | "starships";

/* ------------------------------------------
   CATEGORY INTERFACES
------------------------------------------- */

export interface Film {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  url: string;
}

export interface Person {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  url: string;
}

export interface Planet {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  population: string;
  url: string;
}

export interface Species {
  name: string;
  classification: string;
  designation: string;
  average_height: string;
  language: string;
  url: string;
}

export interface Vehicle {
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  crew: string;
  passengers: string;
  vehicle_class: string;
  url: string;
}

export interface Starship {
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  crew: string;
  passengers: string;
  starship_class: string;
  url: string;
}

/* ------------------------------------------
   MAP CATEGORY → TYPE
------------------------------------------- */

export interface SwapiDataMap {
  films: Film;
  people: Person;
  planets: Planet;
  species: Species;
  vehicles: Vehicle;
  starships: Starship;
}
// FILE: swapi-types.ts