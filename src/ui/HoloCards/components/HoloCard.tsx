
"use client";

import Link from "next/link";
import styles from "../styles/HoloCard.module.css";
import HoloIcon, { HoloIconName } from "@/ui/icons/HoloIcon";

type Props = {
  title: string;
  subtitle?: string;
  href: string;
  icon?: HoloIconName;
};

export default function HoloCard({
  title,
  subtitle,
  href,
  icon,
}: Props) {
  return (
    <Link
      href={href}
      className={styles.wrapper}
      aria-label={`Open ${title}`}
    >
      <div className={styles.surface}>

        {/* targeting frame */}
        <div className={styles.moduleFrame} />

        {/* visual effects */}
        <div className={styles.glow} />
        <div className={styles.sweep} />

        {/* card content */}
        <div className={styles.content}>

          {icon && (
            <div className={styles.icon}>
              <HoloIcon name={icon} />
            </div>
          )}

          <div className={styles.title}>
            {title}
          </div>

          {subtitle && (
            <div className={styles.subtitle}>
              {subtitle}
            </div>
          )}

          <div className={styles.moduleStatus}>
            MODULE READY
          </div>

        </div>

      </div>
    </Link>
  );
}