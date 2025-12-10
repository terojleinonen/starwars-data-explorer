// FILE: StarshipsHeader.tsx
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshBasicMaterial, Color, Mesh } from "three";

interface Props {
  theme: "light" | "dark";
}

export const StarshipsHeader: React.FC<Props> = ({ theme }) => {
  const group = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.5) * 0.3;
      group.current.rotation.x = Math.cos(t * 0.3) * 0.1;
    }
  });

  const glow = new Color(theme === "dark" ? "#60a5fa" : "#2563eb");

  const mat = new MeshBasicMaterial({
    color: glow,
    wireframe: true,
    transparent: true,
    opacity: 0.85,
  });

  return (
    <group ref={group} scale={1.3}>
      {/* Body */}
      <mesh material={mat}>
        <boxGeometry args={[2, 0.3, 0.6]} />
      </mesh>

      {/* Wing Left */}
      <mesh material={mat} position={[-1.2, 0, 0]}>
        <boxGeometry args={[1.2, 0.15, 0.4]} />
      </mesh>

      {/* Wing Right */}
      <mesh material={mat} position={[1.2, 0, 0]}>
        <boxGeometry args={[1.2, 0.15, 0.4]} />
      </mesh>

      {/* Cockpit */}
      <mesh material={mat} position={[0, 0.2, 0]}>
        <boxGeometry args={[0.6, 0.3, 0.4]} />
      </mesh>

      {/* Light */}
      <ambientLight intensity={0.4} />
    </group>
  );
};