"use client";

export default function SectorLayer() {

  return (
    <svg
      className="sectorLayer"
      viewBox="0 0 1600 900"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
    >
      {/* outer rim boundary */}
      <path
        d="M 200 450 Q 800 150 1400 450"
        className="sectorArc"
      />
      {/* core worlds boundary */}
      <path
        d="M 450 550 Q 1000 250 1500 500"
        className="sectorArc"
      />
      {/* divider line */}
      <line
        x1="800"
        y1="0"
        x2="800"
        y2="900"
        className="sectorDivider"
      />
      {/* sector labels */}
      <text
        x="200"
        y="300"
        className="sectorLabel"
      >
        UNKNOWN REGIONS
      </text>
      <text
        x="450"
        y="420"
        className="sectorLabel"
      >
        OUTER RIM
      </text>
      <text
        x="1180"
        y="360"
        className="sectorLabel"
      >
        CORE WORLDS
      </text>
    </svg>
  );
}