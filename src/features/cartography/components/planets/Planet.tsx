"use client";

import { useMap } from "../../context/MapContext"
import styles from "@/features/cartography/styles/Planet.module.css";

type Props = {
  name: string
  x: number
  y: number
  size: number
  theme?: "dark" | "light"
}

export default function Planet({
  name,
  x,
  y,
  size,
  theme = "dark"
}: Props){

  const { setHoveredPlanet } = useMap()

  return (

    <div
      className={styles.container}
      style={{ left:x, top:y, width:size, height:size }}
      onMouseEnter={() => setHoveredPlanet(name)}
      onMouseLeave={() => setHoveredPlanet(undefined)}
    >
      {/* orbit rings */}
      <svg className={styles.rings}>
        <circle cx="50%" cy="50%" r="65%" />
        <circle cx="50%" cy="50%" r="90%" />
      </svg>
      {/* planet body */}
      <div
        className={[
          styles.planet,
          theme === "dark"
            ? styles.darkPlanet
            : styles.lightPlanet
        ].join(" ")}
      />
      {/* label */}
      <span className={styles.label}>
        {name.toUpperCase()}
      </span>
    </div>
  )
}