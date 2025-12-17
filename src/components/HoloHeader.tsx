// FILE: HoloHeader.tsx
import React from "react";
import styles from "./HoloHeader.module.css";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { PlanetsHeader } from "./headers/PlanetsHeader";
import { StarshipsHeader } from "./headers/StarshipsHeader";
import { PeopleHeader } from "./headers/PeopleHeader";
import { VehiclesHeader } from "./headers/VehiclesHeader";
import { SpeciesHeader } from "./headers/SpeciesHeader";
import { FilmsHeader } from "./headers/FilmsHeader";

interface Props {
  category: string;
  theme: "light" | "dark";
}

export const HoloHeader: React.FC<Props> = ({ category, theme }) => {
  const renderScene = () => {
    switch (category) {
      case "planets":
        return <PlanetsHeader theme={theme} />;
      case "starships":
        return <StarshipsHeader theme={theme} />;
      case "people":
        return <PeopleHeader theme={theme} />;
      case "vehicles":
        return <VehiclesHeader theme={theme} />;
      case "species":
        return <SpeciesHeader theme={theme} />;
      case "films":
        return <FilmsHeader theme={theme} />;
      default:
        return null;
    }
  };

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 40 }}>
        {renderScene()}
        <EffectComposer>
          <Bloom
            intensity={1.2}        // strength of glow
            luminanceThreshold={0.25} // what starts glowing
            luminanceSmoothing={0.9}
            radius={0.7}           // spread of glow
          />
         </EffectComposer>
      </Canvas>
      <div className={styles.label}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </div>
    </div>
  );
};