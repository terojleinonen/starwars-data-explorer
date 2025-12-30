"use client";

type Props = {
  seed: string;
  accentRgb: string;
};

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i);
  }
  return Math.abs(h);
}

export default function ProceduralTile({
  seed,
  accentRgb,
}: Props) {
  const h = hash(seed);

  const cx = 20 + (h % 60);
  const cy = 20 + ((h >> 3) % 60);
  const r1 = 12 + (h % 18);
  const r2 = r1 + 10;

  return (
    <svg
      viewBox="0 0 100 100"
      width="100%"
      height="100%"
      aria-hidden
    >
      <defs>
        <radialGradient
          id={`g-${h}`}
          cx={`${cx}%`}
          cy={`${cy}%`}
          r="60%"
        >
          <stop
            offset="0%"
            stopColor={`rgba(${accentRgb},0.45)`}
          />
          <stop
            offset="100%"
            stopColor="rgba(0,0,0,0)"
          />
        </radialGradient>
      </defs>

      <rect
        x="0"
        y="0"
        width="100"
        height="100"
        fill={`url(#g-${h})`}
      />

      <circle
        cx="50"
        cy="50"
        r={r1}
        fill="none"
        stroke={`rgba(${accentRgb},0.7)`}
        strokeWidth="1"
      />

      <circle
        cx="50"
        cy="50"
        r={r2}
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="0.5"
      />

      <line
        x1="10"
        y1={20 + (h % 60)}
        x2="90"
        y2={20 + (h % 60)}
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="0.6"
      />
    </svg>
  );
}