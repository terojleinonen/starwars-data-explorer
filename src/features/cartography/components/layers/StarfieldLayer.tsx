"use client";

export default function StarfieldLayer(){

  return(

    <g className="starfieldLayer">

      <rect
        x="0"
        y="0"
        width="1600"
        height="900"
        className="starfieldTexture"
        filter="url(#starNoise)"
      />

      <rect
        x="0"
        y="0"        
        width="1600"
        height="900"
        className="starfieldTextureFar"
        filter="url(#starNoise)"
      />
    </g>
  )
}