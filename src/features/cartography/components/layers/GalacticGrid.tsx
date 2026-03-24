"use client";

export default function GalacticGrid() {

  const cols = 8;
  const rows = 5;

  const width = 1600;
  const height = 900;

  const cellW = width / cols;
  const cellH = height / rows;

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return (
    <g className="galacticGrid">

      {/* vertical lines */}
      {Array.from({ length: cols + 1 }).map((_, i) => {
        const x = i * cellW;
        return (
          <line
            key={"v" + i}
            x1={x}
            y1={0}
            x2={x}
            y2={height}
            className="gridLine"
          />
        );
      })}

      {/* horizontal lines */}
      {Array.from({ length: rows + 1 }).map((_, i) => {
        const y = i * cellH;
        return (
          <line
            key={"h" + i}
            x1={0}
            y1={y}
            x2={width}
            y2={y}
            className="gridLine"
          />
        );
      })}

      {/* grid labels */}
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: cols }).map((_, col) => {

          const x = col * cellW + 20;
          const y = row * cellH + 30;

          const label = `${letters[row]}${col + 1}`;

          return (
            <text
              key={label}
              x={x}
              y={y}
              className="gridLabel"
            >
              {label}
            </text>
          );
        })
      )}

    </g>
  );
}