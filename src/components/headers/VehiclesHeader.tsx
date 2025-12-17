// FILE: VehiclesHeader.tsx
// Procedural holographic vehicle blueprint header (strict TypeScript, R3F safe)

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Mesh,
  MeshBasicMaterial,
  Color,
  Group,
} from "three";
import { HolographicTitle } from "../HolographicTitle";

interface Props {
  theme: "light" | "dark";
}

export const VehiclesHeader: React.FC<Props> = ({ theme }) => {
  const groupRef = useRef<Group>(null);

  const glow = new Color(theme === "dark" ? "#7dd3fc" : "#0284c7");

  const mat = new MeshBasicMaterial({
    color: glow,
    wireframe: true,
    transparent: true,
    opacity: 0.85,
  });

  useFrame(({ clock, mouse }) => {
    const t = clock.getElapsedTime();
    const pulse = 0.8 + Math.sin(t * 2.4) * 0.2;

    if (groupRef.current) {
      // floating hover animation
      groupRef.current.position.y = Math.sin(t * 1.2) * 0.05;

      // parallax tilt
      groupRef.current.rotation.y = mouse.x * 0.35;
      groupRef.current.rotation.x = mouse.y * 0.2;

      // SAFELY animate opacity of only mesh materials
      groupRef.current.children.forEach((child) => {
        const mesh = child as Mesh;

        // Skip non-mesh (lights, groups, etc.)
        if (!("material" in mesh)) return;

        const material = mesh.material;

        // Ignore invalid material references
        if (!material || typeof material !== "object") return;

        // Handle array materials
        if (Array.isArray(material)) {
          material.forEach((m) => {
            if ("opacity" in m) m.opacity = pulse;
          });
          return;
        }

        // Handle single material
        if ("opacity" in material) {
          material.opacity = pulse;
        }
      });
    }
  });

  return (
    <group ref={groupRef} scale={1.4}>
      <HolographicTitle
        text="Vehicles"
        color={theme === "dark" ? "#7dd3fc" : "#0284c7"}
        position={[0, -1.5, 0]}
      />

      {/* Lights */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[2, 2, 3]} intensity={0.7} color={glow} />
    </group>
  );
};