"use client";

import Link from "next/link";
import styles from "../styles/HoloCard.module.css";

type Props = {
  title: string;
  subtitle?: string;
  href: string;
  category: string;
};

export default function HoloCard({ title, subtitle, href, category }: Props) {
  return (
    <Link href={href} className={styles.card} data-category={category}>
      <div className={styles.glow} />
      <div className={styles.sweep} />
      <div className={styles.grid} />

      <div className={styles.inner}>
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <div className={styles.footer}>
        <span>Open record</span>
      </div>
    </Link>
  );
}