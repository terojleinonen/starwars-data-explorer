"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { SwapiType } from "@/components/types/swapi-types";



/* ================= TYPES ================= */

type AtmosphereContextValue = {
  category: SwapiType | undefined;
  setCategory: (c: SwapiType | undefined) => void;

  activeHighlight: SwapiType | null;
  setActiveHighlight: (c: SwapiType | null) => void;
};
/* ================= CONTEXT ================= */

const AtmosphereContext =
  createContext<AtmosphereContextValue | null>(null);

/* ================= PROVIDER ================= */

export function AtmosphereProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [category, setCategory] = useState<SwapiType | undefined>(
    undefined
  );

  const [activeHighlight, setActiveHighlight] = useState<SwapiType | null>(
    null
  );


  return (
    <AtmosphereContext.Provider
      value={{
        category,
        setCategory,
        activeHighlight,
        setActiveHighlight,
      }}
    >
      {children}
    </AtmosphereContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useAtmosphere() {
  const ctx = useContext(AtmosphereContext);
  if (!ctx) {
    throw new Error(
      "useAtmosphere must be used within AtmosphereProvider"
    );
  }
  return ctx;
}