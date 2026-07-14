import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./primitives.module.css";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary" | "secondary" | "quiet" | "plate";
  size?: "sm" | "md" | "lg";
  iconOnly?: boolean;
  children: ReactNode;
};

export function Button({ variant = "default", size = "md", iconOnly = false, className = "", type = "button", ...props }: Props) {
  const variants = { default: "", primary: styles.buttonPrimary, secondary: styles.buttonSecondary, quiet: styles.buttonQuiet, plate: styles.buttonPlate };
  const sizes = { sm: styles.buttonSmall, md: "", lg: styles.buttonLarge };
  return <button type={type} className={`${styles.button} ${variants[variant]} ${sizes[size]} ${iconOnly ? styles.buttonIcon : ""} ${className}`} {...props} />;
}
