"use client";

type Props = {
  x: number
  y: number
  size: number
  name: string
}

export default function Planet({ x, y, size, name }: Props){

  const r = size

  return (

    <g className="planet">

      {/* halo */}
      <circle
        cx={x}
        cy={y}
        r={r * 4}
        className="planetGlow"
      />

      {/* orbit ring */}
      <circle
        cx={x}
        cy={y}
        r={r * 3}
        className="planetOrbit"
      />

      {/* planet body */}
      <circle
        cx={x}
        cy={y}
        r={r}
        className="planetCore"
      />

      {/* highlight */}
      <circle
        cx={x - r * 0.3}
        cy={y - r * 0.3}
        r={r * 0.35}
        className="planetHighlight"
      />

      {/* navigation beacon */}
      <polygon
        points={`${x+6},${y-4} ${x+12},${y} ${x+6},${y+4}`}
        className="navBeacon"
      />

      {/* label */}
      <text
        x={x}
        y={y + r + 14}
        className="planetLabel"
      >
        {name}
      </text>

    </g>

  )

}