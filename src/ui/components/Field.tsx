import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import styles from "./primitives.module.css";

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label?: string };
type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { label?: string };

export function TextField({ label, className = "", ...props }: InputProps) {
  return <label className={styles.field}>{label && <span className={styles.fieldLabel}>{label}</span>}<span className={styles.controlWrap}><input className={`${styles.control} ${className}`} {...props} /></span></label>;
}

export function SelectField({ label, className = "", children, ...props }: SelectProps) {
  return <label className={styles.field}>{label && <span className={styles.fieldLabel}>{label}</span>}<span className={styles.controlWrap}><select className={`${styles.control} ${styles.select} ${className}`} {...props}>{children}</select><span className={styles.selectChevron} aria-hidden="true">▼</span></span></label>;
}
