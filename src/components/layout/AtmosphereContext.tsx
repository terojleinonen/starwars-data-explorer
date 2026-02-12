"use client";

import { createContext, useContext, useState } from "react";
import type { SwapiType } from "@/components/types/swapi-types";

type AtmosphereState = {
  activeHighlight?: SwapiType;
  setHighlight: (cat?: SwapiType) => void;
};

const AtmosphereContext = createContext<AtmosphereState>({
  activeHighlight: undefined,
  setHighlight: () => {},
});

export function AtmosphereProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeHighlight, setActiveHighlight] = useState<SwapiType | undefined>();

  return (
    <AtmosphereContext.Provider
      value={{
        activeHighlight,
        setHighlight: setActiveHighlight,
      }}
    >
      {children}
    </AtmosphereContext.Provider>
  );
}

export function useAtmosphere() {
  return useContext(AtmosphereContext);
}