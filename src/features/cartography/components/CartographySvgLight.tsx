"use client";

import {
  CartographyScene,
  TargetReticle,
  SectorLabels,
  FleetMarker
} from "@/features/cartography";

type Props = {
  category?: string,
  device?: "desktop" | "tablet" | "mobile"
};

export default function CartographySvgLight({ category, device }: Props) {

  return (
    <>
      <CartographyScene/>
      <TargetReticle />
      <SectorLabels />
      <FleetMarker x={700} y={420} faction="rebel" rotation={25} />
      <FleetMarker x={900} y={260} faction="empire" rotation={-40} />
    </>
  )
}