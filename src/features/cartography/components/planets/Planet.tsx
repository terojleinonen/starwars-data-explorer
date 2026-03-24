"use client";

import { useTheme } from "@/theme/ThemeProvider";

type Props = {
  x: number
  y: number
  size: number
  name: string
}

export default function Planet({ x, y, size, name }: Props){
  const { theme } = useTheme();
  const r = size;

  return (
    <g className="planet">
      {/* Define gradients for 3D effect in dark theme */}
      {theme === "dark" && (
        <defs>
          <radialGradient id={`planetGradient-${name}`} cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="rgba(220,240,255,0.9)" />
            <stop offset="60%" stopColor="rgba(120,180,255,0.7)" />
            <stop offset="100%" stopColor="rgba(60,120,200,0.9)" />
          </radialGradient>
          <radialGradient id={`planetHighlightGradient-${name}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
          </radialGradient>
        </defs>
      )}

      {/* halo - only in dark theme */}
      {theme === "dark" && (
        <circle
          cx={x}
          cy={y}
          r={r * 4}
          className="planetGlow"
        />
      )}

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
        fill={theme === "dark" ? `url(#planetGradient-${name})` : undefined}
      />

      {/* highlight */}
      <circle
        cx={x - r * 0.3}
        cy={y - r * 0.3}
        r={r * 0.35}
        className="planetHighlight"
        fill={theme === "dark" ? `url(#planetHighlightGradient-${name})` : undefined}
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
        textAnchor="middle"
      >
        {name}
      </text>
    </g>
  )
}