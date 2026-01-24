"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";

/* ======================================================
   Types
====================================================== */

export type NavigationEntry = {
  label: string;
  href: string;
};

export type NavigationHistoryContextValue = {
  history: NavigationEntry[];
  register: (entry: NavigationEntry) => void;
  clear: () => void;
};

/* ======================================================
   Context
====================================================== */

const NavigationHistoryContext =
  createContext<NavigationHistoryContextValue | null>(null);

/* ======================================================
   Provider
====================================================== */

type ProviderProps = {
  children: ReactNode;
};

export function NavigationHistoryProvider({
  children,
}: ProviderProps) {
  const [history, setHistory] = useState<NavigationEntry[]>([]);

  /**
   * Track last registered href to prevent duplicates
   * (important for strict mode + rerenders)
   */
  const lastHrefRef = useRef<string | null>(null);

  const register = useCallback(
    (entry: NavigationEntry) => {
      setHistory((prev) => {
        // Prevent consecutive duplicates
        if (lastHrefRef.current === entry.href) {
          return prev;
        }

        lastHrefRef.current = entry.href;

        return [...prev, entry];
      });
    },
    []
  );

  const clear = useCallback(() => {
    lastHrefRef.current = null;
    setHistory([]);
  }, []);

  return (
    <NavigationHistoryContext.Provider
      value={{ history, register, clear }}
    >
      {children}
    </NavigationHistoryContext.Provider>
  );
}

/* ======================================================
   Hook
====================================================== */

export function useNavigationHistory() {
  const ctx = useContext(NavigationHistoryContext);

  if (!ctx) {
    throw new Error(
      "useNavigationHistory must be used within NavigationHistoryProvider"
    );
  }

  return ctx;
}