"use client";

import { useEffect, useRef, useState } from "react";
import type { SwapiType } from "@/lib/swapi/swapiTypes";
import styles from "../styles/CartographyBackground.module.css";
import { useTheme } from "@/theme/ThemeProvider";
import CartographySvgDark from "./CartographySvgDark";
import CartographySvgLight from "./CartographySvgLight";


/* =====================================================
Props
===================================================== */

type Props = {
  category?: SwapiType
  className?: string
  children?: React.ReactNode
};


/* =====================================================
Component
===================================================== */

export default function CartographyBackground({
  category,
  className,
  children
}: Props) {

  const rootRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">(
    getDeviceClass()
  )


  /* -------------------------------------------------
     Update device class on resize
  ------------------------------------------------- */

  useEffect(() => {

    function handleResize() {
      setDevice(getDeviceClass())
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])


  /* =================================================
     Render
  ================================================= */

  return (

    <div
      ref={rootRef}
      className={[
        styles.root,
        className ?? ""
      ].join(" ")}
    >

      {/* =================================================
          MAP SVG LAYER
      ================================================= */}

      <div className={styles.svgLayer} aria-hidden>
        {theme === "dark" ? (
          <CartographySvgDark
            category={category}
            device={device}
          />
        ) : (
          <CartographySvgLight
            category={category}
            device={device}
          />
        )}
      </div>
      {/* =================================================
          ATMOSPHERE LAYERS
      ================================================= */}
      <div className={styles.fog} aria-hidden />
      <div className={styles.starfield} aria-hidden />

      {/* =================================================
          UI CONTENT
      ================================================= */}
      <div className={styles.overlay}>
        {children}
      </div>
    </div>
  )
}


/* =====================================================
Device detection helper
===================================================== */

function getDeviceClass(): "desktop" | "tablet" | "mobile" {
  if (typeof window === "undefined") return "desktop"
  const w = window.innerWidth
  if (w < 640) return "mobile"
  if (w < 1024) return "tablet"
  return "desktop"
}