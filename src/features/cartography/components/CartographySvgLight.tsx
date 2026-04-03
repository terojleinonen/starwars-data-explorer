export default function CartographySvgLight() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 800">
      <circle
        cx="400"
        cy="400"
        r="280"
        stroke="rgba(40, 100, 160, 0.4)"
        strokeWidth="1.5"
        fill="none"
      />
      <circle
        cx="400"
        cy="400"
        r="180"
        stroke="rgba(40, 100, 160, 0.3)"
        strokeWidth="1.5"
        fill="none"
      />
      <circle
        cx="400"
        cy="400"
        r="380"
        stroke="rgba(80, 140, 200, 0.25)"
        strokeWidth="1"
        fill="none"
        strokeDasharray="8,4"
      />
    </svg>
  );
}