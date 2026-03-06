"use client";

import { useMemo } from "react";

type Star = {
  x: number
  y: number
  r: number
  opacity: number
}

export default function StarfieldLayer(){

  const stars = useMemo<Star[]>(() => {
    const arr: Star[] = []
    for(let i = 0; i < 220; i++){
      arr.push({
        x: Math.random() * 1600,
        y: Math.random() * 900,
        r: Math.random() * 1.2 + 0.2,
        opacity: Math.random() * 0.8 + 0.2
      })
    }
    return arr
  }, [])

  return (
    <svg
      className="starfieldLayer"
      viewBox="0 0 1600 900"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
    >
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill="white"
          opacity={s.opacity}
        />
      ))}
    </svg>
  )
}