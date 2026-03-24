"use client";

import {
  CartographyScene,
  TargetReticle,
} from "@/features/cartography";

export default function CartographySvgDark({ category, device }: { category?: string; device?: string }) {

  return (
    <>
      <CartographyScene />
      <TargetReticle /> 
    </>
  )
}