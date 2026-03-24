"use client";

import { createContext, useContext, useState } from "react";

type AtmosphereState = {
  activeHighlight?: string;
  setHighlight: (cat?: string) => void;
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
  const [activeHighlight, setActiveHighlight] = useState<string | undefined>();

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