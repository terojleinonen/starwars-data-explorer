"use client";

import type { SwapiType } from "@/lib/swapi/swapiTypes";
import { MapProvider } from "../context/MapContext";

import {
  StarfieldLayer,
  CartographyScene,
  PlanetLayer,
  TargetReticle,
  FleetMarker,
  Annotation
} from "@/features/cartography";

type Props = {
  category?: SwapiType
  device?: "desktop" | "tablet" | "mobile"
};

export default function CartographySvgDark({
  category,
  device
}: Props) {

  return (

    <>
      <MapProvider>
        <StarfieldLayer />
        <CartographyScene />
        <PlanetLayer
          theme="dark"
          device={device}
        />
        <TargetReticle />
        <Annotation text="REBEL OUTPOST" x={780} y={310}/>
        <FleetMarker x={700} y={420} faction="rebel" rotation={25} />
        <FleetMarker x={900} y={260} faction="empire" rotation={-40} /> 
       </MapProvider>
    </>
  )
}