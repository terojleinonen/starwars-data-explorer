"use client";

export default function TargetReticle(){

  return (
    <svg
      className="targetReticle"
      viewBox="0 0 1600 900"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
    >
      <g transform="translate(800 450)">
        {/* outer ring */}
        <circle
          r="140"
          className="reticleRing"
        />
        {/* pulsing lock */}
        <circle
          r="60"
          className="reticlePulse"
        />
        {/* crosshair */}
        <line x1="-160" y1="0" x2="-60" y2="0" className="reticleLine"/>
        <line x1="60" y1="0" x2="160" y2="0" className="reticleLine"/>
        <line x1="0" y1="-160" x2="0" y2="-60" className="reticleLine"/>
        <line x1="0" y1="60" x2="0" y2="160" className="reticleLine"/>
        {/* rotating radar sweep */}
        <g className="reticleSweep">
          <path
            d="M0 0 L140 0 A140 140 0 0 1 110 70 Z"
            className="reticleSweepCone"
          />
        </g>
      </g>
    </svg>
  )
}