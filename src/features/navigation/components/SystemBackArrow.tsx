import { BackArrowGlyph } from "@/features/navigation";
import styles from "../styles/SystemBackArrow.module.css";

type Props = {
  onClick?: () => void;
  label?: string;
};

export default function SystemBackArrow({
  onClick,
  label = " Back",
}: Props) {
  return (
    <div
      className={styles.back}
      role="button"
      tabIndex={0}
      onClick={() => {
        onClick?.();
      }}
    >
      <BackArrowGlyph className={styles.arrow} />
      <span className={styles.label}>{label}</span>
    </div>
  );
}