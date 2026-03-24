"use client";

export default function NebulaLayer(){

  return(

    <g className="nebulaLayer">

      <ellipse
        cx="520"
        cy="420"
        rx="520"
        ry="240"
        className="nebulaCloud"
      />

      <ellipse
        cx="1100"
        cy="520"
        rx="420"
        ry="200"
        className="nebulaCloud"
      />

      <ellipse
        cx="900"
        cy="260"
        rx="380"
        ry="160"
        className="nebulaCloud"
      />

    </g>

  )

}