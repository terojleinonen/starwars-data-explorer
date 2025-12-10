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

interface Props {
  theme: "light" | "dark";
}

/**
 * A procedural "human silhouette"-like shape created from a simple outline.
 * This is abstract enough that it is NOT identifiable as a real human,
 * but visually communicates "people" or "sentient profiles."
 */
function createSilhouetteGeometry(): BufferGeometry {
  // Outline of a generic humanoid head + shoulders (abstract, low-poly)
  const points = [
    // Head
    -0.4, 0.6, 0,
    -0.3, 0.8, 0,
    0.3, 0.8, 0,
    0.4, 0.6, 0,
    0.4, 0.2, 0,
    -0.4, 0.2, 0,

    // Neck + shoulders
    -0.25, 0.2, 0,
    -0.5, -0.2, 0,
    0.5, -0.2, 0,
    0.25, 0.2, 0,
  ];

  const geo = new BufferGeometry();
  geo.setAttribute("position", new Float32BufferAttribute(points, 3));
  geo.setDrawRange(0, points.length / 3);
  return geo;
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
      {/* Holographic silhouette */}
      <mesh
        ref={silhouetteRef}
        geometry={createSilhouetteGeometry()}
        material={mat}
      />

      {/* Ambient hologram fill */}
      <ambientLight intensity={0.35} />

      {/* Soft hologram rim light */}
      <directionalLight position={[1, 2, 3]} intensity={0.6} color={color} />
    </group>
  );
};