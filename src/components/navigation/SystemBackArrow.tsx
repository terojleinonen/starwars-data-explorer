import { BackArrowGlyph } from "./BackArrowGlyph";
import { tapHaptic } from "@/utils/haptics";
import styles from "./SystemBackArrow.module.css";

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
        tapHaptic();
        onClick?.();
      }}
      onTouchStart={tapHaptic}
    >
      <BackArrowGlyph className={styles.arrow} />
      <span className={styles.label}>{label}</span>
    </div>
  );
}