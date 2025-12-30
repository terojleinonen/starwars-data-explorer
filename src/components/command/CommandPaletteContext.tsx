"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

export type CommandItem = {
  id: string;
  label: string;
  href: string;
  category: string;
};

type ContextType = {
  open: () => void;
  close: () => void;
  registerItems: (items: CommandItem[]) => void;
};

const CommandPaletteContext =
  createContext<ContextType | null>(null);

export function CommandPaletteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CommandItem[]>([]);
  const router = useRouter();

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  function registerItems(next: CommandItem[]) {
    setItems(next);
  }

  // Global keyboard shortcut
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key.toLowerCase() === "k"
      ) {
        e.preventDefault();
        setIsOpen((v) => !v);
      }

      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", onKey);
    return () =>
      window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <CommandPaletteContext.Provider
      value={{ open, close, registerItems }}
    >
      {children}
      {isOpen && (
        <CommandPalette
          items={items}
          onSelect={(href: string) => {
            setIsOpen(false);
            router.push(href);
          }}
          onClose={() => setIsOpen(false)}
        />
      )}
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPalette() {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) {
    throw new Error(
      "useCommandPalette must be used inside provider"
    );
  }
  return ctx;
}

/* =========================
   Internal component import
========================= */

import CommandPalette from "./CommandPalette";