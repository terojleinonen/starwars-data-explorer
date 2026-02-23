import Link from "next/link";
import styles from "./HoloCard.module.css";
import HoloIcon, { type HoloIconName } from "../holo/HoloIcon";

type Props = {
  title: string;
  subtitle: string;
  href: string;
  icon?: HoloIconName;
};

export default function HoloCard({ title, subtitle, href, icon }: Props) {
  return (
    <Link href={href} className={styles.card} prefetch>
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <div className={styles.label}>DATABASE</div>

          {icon ? (
            <div className={styles.emblem} aria-hidden="true">
              <HoloIcon name={icon} className={styles.icon} title={title} />
              <div className={styles.emblemGlow} />
            </div>
          ) : null}
        </div>

        <h3 className={styles.title}>{title}</h3>
        <p className={styles.subtitle}>{subtitle}</p>

        <div className={styles.footer}>
          <span>Open</span>
          <span className={styles.arrow}>→</span>
        </div>

        <div className={styles.glow} />
      </div>
    </Link>
  );
}