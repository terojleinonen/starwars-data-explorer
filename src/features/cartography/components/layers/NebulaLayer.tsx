"use client";

import { useTheme } from "@/theme/ThemeProvider";

export default function NebulaLayer(){
  const { theme } = useTheme();
  
  // Only render in dark theme
  if (theme !== "dark") return null;

  return(
    <g className="nebulaLayer">
      <ellipse
        cx="520"
        cy="420"
        rx="520"
        ry="240"
        className="nebulaCloud"
        fill="#0c4a6e"
        style={{ fill: 'url(#nebulaGradient)' }}
      />
      <ellipse
        cx="1100"
        cy="520"
        rx="420"
        ry="200"
        className="nebulaCloud"
        fill="#0c4a6e"
        style={{ fill: 'url(#nebulaGradient)' }}
      />
      <ellipse
        cx="900"
        cy="260"
        rx="380"
        ry="160"
        className="nebulaCloud"
        fill="#0c4a6e"
        style={{ fill: 'url(#nebulaGradient)' }}
      />
    </g>
  )
}