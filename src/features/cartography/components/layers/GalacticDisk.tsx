"use client";

export default function GalacticDisc(){

  return(

    <g className="galacticDisc">
      <ellipse
        cx="800"
        cy="480"
        rx="900"
        ry="260"
        className="galaxyCore"
      />
      <ellipse
        cx="800"
        cy="480"
        rx="1100"
        ry="320"
        className="galaxyHalo"
      />
    </g>
  )
}