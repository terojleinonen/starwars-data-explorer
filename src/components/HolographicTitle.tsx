// FILE: src/components/HolographicTitle.tsx

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Color } from "three";
import { Text } from "@react-three/drei";

interface Props {
  text: string;
  color: string;
  position?: [number, number, number];
}

export const HolographicTitle: React.FC<Props> = ({
  text,
  color,
  position = [0, -1.1, 0.25],
}) => {
  const groupRef = useRef<Group>(null);
  const glowRef = useRef<Group>(null);
  const baseColor = new Color(color);

  useFrame(({ clock, mouse }) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = mouse.x * 0.12;
      groupRef.current.rotation.x = mouse.y * 0.06;
      groupRef.current.position.y =
        position[1] + Math.sin(t * 1.2) * 0.05;
    }

    if (glowRef.current) {
      const flicker = 0.22 + Math.sin(t * 12) * 0.05;
      glowRef.current.children.forEach((c: any) => {
        if (c.material) c.material.opacity = flicker;
      });
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Main title */}
      <Text
        fontSize={0.9}
        letterSpacing={0.18}
        anchorX="center"
        anchorY="middle"
        color={baseColor}
        material-toneMapped={false}
      >
        {text}
      </Text>

      {/* Glow volume */}
      <group ref={glowRef}>
        <Text
          fontSize={0.92}
          letterSpacing={0.18}
          anchorX="center"
          anchorY="middle"
          color={baseColor}
          position={[0, 0, -0.12]}
          material-transparent
          material-opacity={0.25}
          material-toneMapped={false}
        >
          {text}
        </Text>
      </group>
    </group>
  );
};
// FILE: src/components/HolographicTitle.tsx