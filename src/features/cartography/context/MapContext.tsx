"use client";

import { createContext, useContext, useState } from "react";

type MapState = {
  selectedPlanet?: string
  hoveredPlanet?: string
}

type MapContextType = {
  state: MapState
  setHoveredPlanet: (name?: string) => void
  setSelectedPlanet: (name?: string) => void
}

const MapContext = createContext<MapContextType | null>(null)

export function MapProvider({ children }: { children: React.ReactNode }) {

  const [state, setState] = useState<MapState>({})

  function setHoveredPlanet(name?: string) {
    setState((s) => ({
      ...s,
      hoveredPlanet: name
    }))
  }

  function setSelectedPlanet(name?: string) {
    setState((s) => ({
      ...s,
      selectedPlanet: name
    }))
  }

  return (
    <MapContext.Provider
      value={{
        state,
        setHoveredPlanet,
        setSelectedPlanet
      }}
    >
      {children}
    </MapContext.Provider>
  )
}

export function useMap(){
  const ctx = useContext(MapContext)

  if(!ctx){
    throw new Error("useMap must be used inside MapProvider")
  }

  return ctx
}