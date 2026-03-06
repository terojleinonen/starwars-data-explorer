"use client";

type SectorLabel = {
  name: string
  x: number
  y: number
};

const sectors: SectorLabel[] = [
  { name: "A3", x: 200, y: 100 },
  { name: "B5", x: 600, y: 320 },
  { name: "C7", x: 1050, y: 260 },
  { name: "D2", x: 350, y: 540 }
];

export default function SectorLabels(){
  return (
    <div className="sectorLabels">
      {sectors.map((sector) => (
        <span
          key={sector.name}
          style={{
            left: sector.x,
            top: sector.y
          }}
        >
          {sector.name}
        </span>
      ))}
    </div>
  );
}