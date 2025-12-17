// FILE: PlanetsHeader.tsx
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, Mesh, BackSide } from "three";
import { HolographicTitle } from "../HolographicTitle";
interface Props {
  theme: "light" | "dark";
}

export const PlanetsHeader: React.FC<Props> = ({ theme }) => {
  const planet = useRef<Mesh>(null);
  const atmosphere = useRef<Mesh>(null);

  useFrame(({ clock, mouse }) => {
    const t = clock.getElapsedTime();
    if (planet.current) {
      planet.current.rotation.y = t * 0.1;
      planet.current.rotation.x = mouse.y * 0.1;
    }
    if (atmosphere.current) {
      atmosphere.current.rotation.y = t * 0.05;
    }
  });

  const baseColor = new Color(theme === "dark" ? "#1e293b" : "#93c5fd");
  const glowColor = new Color(theme === "dark" ? "#3b82f6" : "#2563eb");

  return (
    <>
      <HolographicTitle
        text="Planets"
        color={theme === "dark" ? "#3b82f6" : "#2563eb"}
        position={[0, -2, 0]}
      />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 2, 4]} intensity={1.2} />
    </>
  );
};