// FILE: PeopleHeader.tsx
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Mesh,
  BufferGeometry,
  Float32BufferAttribute,
  MeshBasicMaterial,
  Color,
  Group,
} from "three";
import { HolographicTitle } from "../HolographicTitle";

interface Props {
  theme: "light" | "dark";
}

export const PeopleHeader: React.FC<Props> = ({ theme }) => {
  const groupRef = useRef<Group>(null);
  const silhouetteRef = useRef<Mesh<BufferGeometry, MeshBasicMaterial> | null>(
    null
  );

  const color = new Color(theme === "dark" ? "#38bdf8" : "#2563eb");

  // Wireframe neon material
  const mat = new MeshBasicMaterial({
    color,
    wireframe: true,
    transparent: true,
    opacity: 0.9,
  });

  // Animation loop
  useFrame(({ clock, mouse }) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      // Subtle breathing animation
      groupRef.current.scale.set(
        1,
        1 + Math.sin(t * 1.5) * 0.02,
        1
      );

      // Parallax tilt
      groupRef.current.rotation.y = mouse.x * 0.3;
      groupRef.current.rotation.x = mouse.y * 0.15;
    }

    if (silhouetteRef.current) {
      silhouetteRef.current.material.opacity =
        0.7 + Math.sin(t * 3.0) * 0.15;
    }
  });

  return (
    <group ref={groupRef} scale={2.2}>
      <HolographicTitle
        text="People"
        color={theme === "dark" ? "#38bdf8" : "#2563eb"}
        position={[0, -1.5, 0]}
      />
      {/* Ambient hologram fill */}
      <ambientLight intensity={0.35} />

      {/* Soft hologram rim light */}
      <directionalLight position={[1, 2, 3]} intensity={0.6} color={color} />
    </group>
  );
};