"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import ArchiveNavigation from "./navigation";

function MobileNavigationDisclosure() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const container = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggle.current?.focus();
    };
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !container.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    const closeOnFocusOutside = (event: FocusEvent) => {
      if (event.target instanceof Node && !container.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    const desktop = window.matchMedia("(min-width: 761px)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("focusin", closeOnFocusOutside);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("focusin", closeOnFocusOutside);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  return (
    <div className="archive-mobile-navigation" ref={container}>
      <button
        ref={toggle}
        type="button"
        className="archive-menu-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close archive menu" : "Open archive menu"}
        onClick={() => setOpen(value => !value)}
      >
        <span>{open ? "Close" : "Menu"}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          {open ? <path d="m6 6 12 12M6 18 18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
        </svg>
      </button>
      <div className="archive-mobile-panel" id={panelId} hidden={!open}>
        <ArchiveNavigation onNavigate={() => setOpen(false)} />
      </div>
    </div>
  );
}

export default function MobileArchiveNavigation() {
  const pathname = usePathname();
  return <MobileNavigationDisclosure key={pathname} />;
}
