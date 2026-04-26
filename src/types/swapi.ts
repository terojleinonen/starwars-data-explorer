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