"use client";

import type { SwapiType } from "@/lib/swapi/swapiTypes";
import { MapProvider } from "../context/MapContext";

import {
  CartographyScene,
  PlanetLayer,
  TargetReticle,
  SectorLabels,
  Annotation,
  TacticalStamp,
  FleetMarker
} from "@/features/cartography";

type Props = {
  category?: SwapiType
  device?: "desktop" | "tablet" | "mobile"
};

export default function CartographySvgLight({
  category,
  device
}: Props) {

  return (

    <>
      <MapProvider>
        <CartographyScene/>
        <PlanetLayer
          theme="light"
          device={device}
        />
        <TargetReticle />
        <SectorLabels />
        <Annotation text="OUTER RIM" x={300} y={180}/>
        <Annotation text="CORE WORLDS" x={1100} y={200}/>
        <Annotation text="REBEL OUTPOST" x={780} y={310}/>
        <TacticalStamp text="TOP SECRET" x={640} y={120}/>
        <FleetMarker x={700} y={420} faction="rebel" rotation={25} />
        <FleetMarker x={900} y={260} faction="empire" rotation={-40} />
      </MapProvider>
    </>
  )
}