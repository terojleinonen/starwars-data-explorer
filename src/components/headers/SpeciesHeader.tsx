// FILE: SpeciesHeader.tsx
// Animated holographic DNA helix header (strict TypeScript, R3F safe)

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Color,
  Group,
  BufferGeometry,
  Float32BufferAttribute,
  LineBasicMaterial,
  PointsMaterial,
} from "three";

interface Props {
  theme: "light" | "dark";
}

export const SpeciesHeader: React.FC<Props> = ({ theme }) => {
  const groupRef = useRef<Group>(null);

  /* -------------------------------------------------------
     THEME COLORS
  ------------------------------------------------------- */
  const strandColor = new Color(theme === "dark" ? "#a78bfa" : "#7c3aed"); // purple-blue biotech
  const rungColor   = new Color(theme === "dark" ? "#c4b5fd" : "#8b5cf6");
  const particleColor = rungColor.clone();

  /* -------------------------------------------------------
     DNA DOUBLE HELIX GEOMETRY
  ------------------------------------------------------- */
  const { strandA, strandB, rungs } = useMemo(() => {
    const strandA: number[] = [];
    const strandB: number[] = [];
    const rungs: number[][] = [];

    const turns = 12;
    const height = 3.5;

    for (let i = 0; i <= 250; i++) {
      const t = (i / 250) * Math.PI * turns;

      const y = (i / 250) * height - height / 2;

      const xA = Math.cos(t) * 0.35;
      const zA = Math.sin(t) * 0.35;

      const xB = Math.cos(t + Math.PI) * 0.35;
      const zB = Math.sin(t + Math.PI) * 0.35;

      strandA.push(xA, y, zA);
      strandB.push(xB, y, zB);

      if (i % 20 === 0) {
        rungs.push([xA, y, zA, xB, y, zB]);
      }
    }

    return { strandA, strandB, rungs };
  }, []);

  /* -------------------------------------------------------
     MATERIALS
  ------------------------------------------------------- */
  const strandMat = new LineBasicMaterial({
    color: strandColor,
    opacity: 0.9,
    transparent: true,
  });

  const rungMat = new LineBasicMaterial({
    color: rungColor,
    opacity: 0.65,
    transparent: true,
  });

  const particleMat = new PointsMaterial({
    color: particleColor,
    size: 0.03,
    opacity: 0.35,
    transparent: true,
  });

  /* -------------------------------------------------------
     PARTICLE FIELD
  ------------------------------------------------------- */
  const particleGeom = useMemo(() => {
    const geom = new BufferGeometry();
    const count = 320;
    const pos: number[] = [];

    for (let i = 0; i < count; i++) {
      pos.push(
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3
      );
    }

    geom.setAttribute("position", new Float32BufferAttribute(pos, 3));
    return geom;
  }, []);

  /* -------------------------------------------------------
     ANIMATION LOOP
  ------------------------------------------------------- */
  useFrame(({ clock, mouse }) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      // slow holographic twist
      groupRef.current.rotation.y = t * 0.25 + mouse.x * 0.4;
      groupRef.current.rotation.x = Math.sin(t * 0.25) * 0.1 + mouse.y * 0.2;

      // breathing effect
      const s = 1 + Math.sin(t * 1.8) * 0.04;
      groupRef.current.scale.set(s, s, s);
    }
  });

  /* -------------------------------------------------------
     BUILD R3F TREE
  ------------------------------------------------------- */
  return (
    <group ref={groupRef} scale={1.7}>
      {/* Strand A */}
      <lineSegments
        geometry={
          (() => {
            const g = new BufferGeometry();
            g.setAttribute(
              "position",
              new Float32BufferAttribute(strandA, 3)
            );
            return g;
          })()
        }
        material={strandMat}
      />

      {/* Strand B */}
      <lineSegments
        geometry={
          (() => {
            const g = new BufferGeometry();
            g.setAttribute(
              "position",
              new Float32BufferAttribute(strandB, 3)
            );
            return g;
          })()
        }
        material={strandMat}
      />

      {/* Rungs */}
      {rungs.map((r, i) => (
        <lineSegments
          key={i}
          geometry={
            (() => {
              const g = new BufferGeometry();
              g.setAttribute(
                "position",
                new Float32BufferAttribute(r, 3)
              );
              return g;
            })()
          }
          material={rungMat}
        />
      ))}

      {/* Floating particles */}
      <points geometry={particleGeom} material={particleMat} />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[2, 2, 2]}
        intensity={0.8}
        color={strandColor}
      />
    </group>
  );
};