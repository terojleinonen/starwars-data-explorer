"use client";

import { CartographyGrid, GalacticGrid, SectorLayer} from "@/features/cartography";

export default function CartographyScene() {

  return (
    <svg
      className="cartographyScene"
      viewBox="0 0 1600 900"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
    >
      <CartographyGrid />
      <GalacticGrid />
      <SectorLayer />
    </svg>
  )
}