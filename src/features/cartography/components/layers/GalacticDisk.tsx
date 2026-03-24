"use client";

import { useTheme } from "@/theme/ThemeProvider";

export default function GalacticDisc(){
  const { theme } = useTheme();
  
  // Only render in dark theme
  if (theme !== "dark") return null;

  return(
    <g className="galacticDisc">
      <ellipse
        cx="800"
        cy="480"
        rx="900"
        ry="260"
        className="galaxyCore"
        fill="#0ea5e9"
        style={{ fill: 'url(#galaxyCoreGradient)' }}
      />
      <ellipse
        cx="800"
        cy="480"
        rx="1100"
        ry="320"
        className="galaxyHalo"
        fill="#1e40af"
        style={{ fill: 'url(#galaxyHaloGradient)' }}
      />
    </g>
  )
}