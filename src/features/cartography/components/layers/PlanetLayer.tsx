"use client";

import Planet from "../planets/Planet";
import { planets } from "../../data/planets";

type Props = {
  theme?: "dark" | "light";
  device?: "desktop" | "tablet" | "mobile";
};

export default function PlanetLayer({ theme = "dark", device = "desktop" }: Props) {

  const scale =
    device === "mobile"
      ? 0.6
      : device === "tablet"
      ? 0.8
      : 1;

  return (
    <div className="planetLayer">

      {planets.map((planet) => (

        <Planet
          key={planet.name}
          name={planet.name}
          x={planet.x}
          y={planet.y}
          size={planet.size * scale}
          theme={theme}
        />

      ))}

    </div>
  );
}