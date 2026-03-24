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
          fill="rgba(80,200,255,0.2)"
          style={{ filter: 'blur(12px)' }}
          opacity="0.8"
        />
      )}

      {/* orbit ring */}
      <circle
        cx={x}
        cy={y}
        r={r * 3}
        className="planetOrbit"
        fill="none"
        stroke={theme === "dark" ? "rgba(120,220,255,0.3)" : "rgba(0,0,0,0.4)"}
        strokeWidth={theme === "dark" ? "1" : "1.5"}
        strokeDasharray="6 6"
        opacity={theme === "dark" ? "0.6" : "0.8"}
      />

      {/* planet body */}
      <circle
        cx={x}
        cy={y}
        r={r}
        className="planetCore"
        fill={theme === "dark" ? `url(#planetGradient-${name})` : "#888"}
        stroke={theme === "dark" ? "none" : "#444"}
        strokeWidth={theme === "dark" ? "0" : "1.5"}
      />

      {/* highlight */}
      <circle
        cx={x - r * 0.3}
        cy={y - r * 0.3}
        r={r * 0.35}
        className="planetHighlight"
        fill={theme === "dark" ? `url(#planetHighlightGradient-${name})` : "#bbb"}
        stroke={theme === "dark" ? "none" : "#999"}
        strokeWidth={theme === "dark" ? "0" : "0.5"}
      />

      {/* navigation beacon */}
      <polygon
        points={`${x+6},${y-4} ${x+12},${y} ${x+6},${y+4}`}
        className="navBeacon"
        fill={theme === "dark" ? "rgba(255,120,120,0.95)" : "#d32f2f"}
        stroke={theme === "dark" ? "none" : "#b71c1c"}
        strokeWidth={theme === "dark" ? "0" : "0.5"}
      />

      {/* label */}
      <text
        x={x}
        y={y + r + 14}
        className="planetLabel"
        textAnchor="middle"
        fill={theme === "dark" ? "rgba(180,220,255,0.7)" : "#333"}
        fontSize="12"
        letterSpacing="0.12em"
        fontWeight={theme === "dark" ? "normal" : "500"}
      >
        {name}
      </text>
    </g>
  )
}