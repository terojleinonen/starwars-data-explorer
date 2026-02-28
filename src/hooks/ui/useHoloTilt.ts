"use client"

import { useMotionValue, useTransform } from "framer-motion"

export default function useHoloTilt() {

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-100,100], [8,-8])
  const rotateY = useTransform(x, [-100,100], [-8,8])

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {

    const rect = e.currentTarget.getBoundingClientRect()

    const offsetX = e.clientX - rect.left - rect.width/2
    const offsetY = e.clientY - rect.top - rect.height/2

    x.set(offsetX)
    y.set(offsetY)
  }

  function reset(){

    x.set(0)
    y.set(0)

  }

  return {
    rotateX,
    rotateY,
    handleMove,
    reset
  }

}