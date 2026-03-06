"use client";

type Props = {
  x: number
  y: number
  faction?: "rebel" | "empire" | "neutral"
  size?: number
  rotation?: number
};

export default function FleetMarker({
  x,
  y,
  faction = "neutral",
  size = 18,
  rotation = 0
}: Props) {

  const color =
    faction === "rebel"
      ? "#7ec8ff"
      : faction === "empire"
      ? "#ff5c5c"
      : "#aaa";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        pointerEvents: "none"
      }}
    >
      <polygon
        points="10,0 20,20 0,20"
        fill={color}
        opacity="0.85"
      />
    </svg>
  );
}