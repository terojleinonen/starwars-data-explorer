import Link from "next/link";
import styles from "./CategoryCard.module.css";

type Props = {
  href: string;
  id: string;
  title: string;
  secondary?: string;
};

export default function CategoryCard({
  href,
  id,
  title,
  secondary,
}: Props) {
  return (
    <Link href={href} className={styles.card}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>
          Record · ID {id}
        </span>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>

        {secondary && (
          <p className={styles.secondary}>
            {secondary}
          </p>
        )}
      </div>

      <div className={styles.footer}>
        <span className={styles.cta}>
          Open record →
        </span>
      </div>
    </Link>
  );
}