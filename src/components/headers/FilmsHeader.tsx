// FILE: FilmsHeader.tsx
// Futuristic holographic film reel for the FILMS category.
// Procedural geometry, strict TypeScript, React Three Fiber safe.

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, Group } from "three";

interface Props {
  theme: "light" | "dark";
}

export const FilmsHeader: React.FC<Props> = ({ theme }) => {
  const groupRef = useRef<Group>(null);
  const reelRef = useRef<Group>(null);

  // Warm cinema color with slight theme variation
  const rimColor = new Color(theme === "dark" ? "#fdba74" : "#f97316");
  const hubColor = new Color(theme === "dark" ? "#fed7aa" : "#fdba74");

  // Precompute sprocket hole positions
  const holePositions = useMemo(() => {
    const result: [number, number, number][] = [];
    const holeCount = 12;
    const radius = 1.25;

    for (let i = 0; i < holeCount; i++) {
      const angle = (i / holeCount) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      result.push([x, y, 0]);
    }
    return result;
  }, []);

  useFrame(({ clock, mouse }) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      // slight parallax tilt from mouse
      groupRef.current.rotation.x = mouse.y * 0.25;
      groupRef.current.rotation.y = mouse.x * 0.25;

      // breathing scale
      const s = 1 + Math.sin(t * 1.8) * 0.03;
      groupRef.current.scale.set(s, s, s);
    }

    if (reelRef.current) {
      // steady reel rotation
      reelRef.current.rotation.z = t * 0.7;
    }
  });

  return (
    <group ref={groupRef} scale={1.8}>
      <group ref={reelRef}>
        {/* Outer glowing ring (film reel rim) */}
        <mesh>
          <torusGeometry args={[1.5, 0.08, 32, 96]} />
          <meshBasicMaterial
            color={rimColor}
            transparent
            opacity={0.9}
            wireframe
          />
        </mesh>

        {/* Inner ring */}
        <mesh>
          <torusGeometry args={[0.8, 0.06, 24, 72]} />
          <meshBasicMaterial
            color={rimColor}
            transparent
            opacity={0.8}
            wireframe
          />
        </mesh>

        {/* Center hub */}
        <mesh>
          <circleGeometry args={[0.25, 32]} />
          <meshBasicMaterial
            color={hubColor}
            transparent
            opacity={0.95}
            wireframe
          />
        </mesh>

        {/* Sprocket holes around the reel */}
        {holePositions.map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]}>
            <circleGeometry args={[0.08, 12]} />
            <meshBasicMaterial
              color={hubColor}
              transparent
              opacity={0.85}
              wireframe
            />
          </mesh>
        ))}
      </group>

      {/* Soft fill light */}
      <ambientLight intensity={0.35} />
      {/* Warm directional highlight */}
      <directionalLight position={[1.5, 2, 3]} intensity={0.7} color={rimColor} />
    </group>
  );
};