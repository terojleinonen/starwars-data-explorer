"use client";

import  CartographyGrid  from "@/features/cartography/components/layers/CartographyGrid";
import GalacticGrid from "@/features/cartography/components/layers/GalacticGrid";
import SectorLayer from "@/features/cartography/components/layers/SectorLayer";
import StarfieldLayer from "@/features/cartography/components/layers/StarfieldLayer";
import HyperspaceRoutes from "@/features/cartography/components/layers/HyperspaceRoutes";
import Annotations from "@/features/cartography/components/layers/Annotation";
import TacticalStamp from "@/features/cartography/components/layers/TacticalStamp";
import PlanetLayer from "./PlanetLayer";
import GalacticDisc from "./GalacticDisk";
import GalacticBand from "./GalacticBand";
import NebulaLayer from "./NebulaLayer";

export default function CartographyScene(){

  return (
    <svg viewBox="0 0 1600 900">
      <defs>

        {/* galaxy glow */}
        <radialGradient id="galaxyCoreGradient">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="1"/>
          <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0"/>
        </radialGradient>

        <radialGradient id="galaxyHaloGradient">
          <stop offset="0%" stopColor="#1e40af" stopOpacity="1"/>
          <stop offset="60%" stopColor="#020617" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#020617" stopOpacity="0"/>
        </radialGradient>

        {/* nebula gradient */}
        <radialGradient id="nebulaGradient">
          <stop offset="0%" stopColor="#2ec6ff" stopOpacity="1"/>
          <stop offset="40%" stopColor="#0c4a6e" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0"/>
        </radialGradient>

        {/* noise texture */}
        <filter id="galaxyNoise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="2"
            seed="7"
          />
          <feColorMatrix type="saturate" values="0"/>
        </filter>

        <filter id="starNoise">

          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="1"
            seed="2"
          />

          <feColorMatrix
            type="matrix"
            values="
              0 0 0 0 1
              0 0 0 0 1
              0 0 0 0 1
              0 0 0 8 -6
              "
          />
        </filter>        
    </defs>
      <StarfieldLayer /> 
      <NebulaLayer />
      <GalacticBand />
      <GalacticDisc />      
      <GalacticGrid />
      <CartographyGrid />
      <SectorLayer />
      <HyperspaceRoutes />
      <Annotations />
      <TacticalStamp />
      <PlanetLayer />
    </svg>
  );
}