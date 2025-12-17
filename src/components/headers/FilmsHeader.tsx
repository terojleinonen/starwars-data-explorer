// FILE: src/components/headers/FilmsHeader.tsx

import React from "react";
import { Group, Color } from "three";
import { HolographicTitle } from "../HolographicTitle";

interface Props {
  theme: "light" | "dark";
}

export const FilmsHeader: React.FC<Props> = ({ theme }) => {
  const color = theme === "dark" ? "#fdba74" : "#f97316";

  return (
    <group scale={1.8}>
      {/* Film reel + strip already here */}

      {/* Holographic title */}
      <HolographicTitle
        text="FILMS"
        color={color}
        position={[0, -1.15, 0.3]}
      />
    </group>
  );
};
// FILE: src/components/headers/FilmsHeader.tsx