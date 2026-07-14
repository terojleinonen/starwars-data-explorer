import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import styles from "./primitives.module.css";

type Material = "paper" | "stone" | "glass" | "metal" | "plate" | "canvas";
type Elevation = 0 | 1 | 2 | 3 | "overlay";
type Padding = "none" | "sm" | "md" | "lg";

type SurfaceProps<T extends ElementType> = {
  as?: T;
  material?: Material;
  elevation?: Elevation;
  padding?: Padding;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

const elevationClass: Record<string, string> = { "0": styles.e0, "1": styles.e1, "2": styles.e2, "3": styles.e3, overlay: styles.overlay };
const paddingClass: Record<Padding, string> = { none: styles.padNone, sm: styles.padSm, md: styles.padMd, lg: styles.padLg };

export function Surface<T extends ElementType = "div">({
  as,
  material = "glass",
  elevation = 1,
  padding = "md",
  className = "",
  children,
  ...props
}: SurfaceProps<T>) {
  const Component = as ?? "div";
  return (
    <Component
      className={`${styles.surface} ${styles[material]} ${elevationClass[String(elevation)]} ${paddingClass[padding]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
