"use client";
import styles from "./NavToggleButton.module.css";

type Props = {
  open: boolean;
  onToggle: () => void;
};

export default function NavToggleButton({
  open,
  onToggle,
}: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={styles.button}
      aria-haspopup="true"
      aria-label="Open navigation menu"
      aria-expanded={open}
      aria-controls="mobile-navigation"
    >
      ☰
    </button>
  );
}
