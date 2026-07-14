import type { ButtonHTMLAttributes } from "react";
import styles from "./primitives.module.css";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean };
export function Chip({ active = false, className = "", type = "button", ...props }: Props) {
  return <button type={type} aria-pressed={active} className={`${styles.chip} ${active ? styles.chipActive : ""} ${className}`} {...props} />;
}
