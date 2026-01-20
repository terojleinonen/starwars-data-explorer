"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { SwapiType } from "@/components/types/swapi-types";

/* ================= TYPES ================= */

export type AtmosphereContextValue = {
  category?: SwapiType;
  setCategory: (category?: SwapiType) => void;
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

  return (
    <AtmosphereContext.Provider
      value={{
        category,
        setCategory,
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