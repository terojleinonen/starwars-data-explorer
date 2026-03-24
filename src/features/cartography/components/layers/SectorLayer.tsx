"use client";

export default function SectorLayer() {

  return (
    <g className="sectorLayer">

      {/* OUTER RIM ARC */}
      <path
        d="M 100 520 Q 800 180 1500 520"
        className="sectorArc outerRim"
        fill="none"
      />

      {/* MID RIM ARC */}
      <path
        d="M 220 560 Q 800 260 1380 560"
        className="sectorArc midRim"
        fill="none"
      />

      {/* CORE WORLDS ARC */}
      <path
        d="M 450 600 Q 800 360 1150 600"
        className="sectorArc coreWorlds"
        fill="none"
      />

      {/* GALACTIC CENTER LINE */}
      <line
        x1="800"
        y1="0"
        x2="800"
        y2="900"
        className="sectorDivider"
      />

      {/* LABELS */}

      <text x="180" y="360" className="sectorLabel">
        UNKNOWN REGIONS
      </text>

      <text x="430" y="470" className="sectorLabel">
        OUTER RIM
      </text>

      <text x="980" y="430" className="sectorLabel">
        MID RIM
      </text>

      <text x="1110" y="520" className="sectorLabel">
        CORE WORLDS
      </text>

      <text x="760" y="500" className="galacticCenter">
        GALACTIC CENTER
      </text>

    </g>
  );
}