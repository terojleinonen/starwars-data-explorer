"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useAtmosphere } from "@/features/layout/components/AtmosphereContext";
import styles from "../styles/RouteTransition.module.css";

type Props = {
  children: ReactNode;
};

export default function RouteTransition({ children }: Props) {
  const pathname = usePathname();
  const [displayPath, setDisplayPath] = useState(pathname);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { setHighlight } = useAtmosphere();


  useEffect(() => {
    if (pathname === displayPath) return;

    setIsTransitioning(true);

    const timeout = setTimeout(() => {
      setHighlight(undefined);
      setDisplayPath(pathname);
      setIsTransitioning(false);
    }, 220); // 👈 timing sweet spot

    return () => clearTimeout(timeout);
  }, [pathname, displayPath]);

  return (
    <div
      className={`${styles.wrapper} ${
        isTransitioning ? styles.transitioning : ""
      }`}
    >
      {children}
    </div>
  );
}