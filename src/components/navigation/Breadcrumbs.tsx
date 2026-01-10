import Link from "next/link";
import styles from "./Breadcrumbs.module.css";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items?: BreadcrumbItem[];
};

export default function Breadcrumbs({
  items,
}: Props) {
  return (
    <nav
      aria-label="Breadcrumb"
      data-breadcrumbs
      className={styles.breadcrumbs}
    >
      <ol>
        {items?.map((item, index) => (
          <li key={index} className={styles.item}>
            {item.href ? (
              <Link
                href={item.href}
                data-nav-label={item.label}
                className={styles.link}
              >
                {item.label}
              </Link>
            ) : (
              <span className={styles.current}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}