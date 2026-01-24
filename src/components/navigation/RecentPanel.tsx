"use client";

import Link from "next/link";
import styles from "./RecentPanel.module.css";
import { useNavigationHistory } from "@/components/navigation/NavigationHistoryContext";

type Props = {
  maxItems?: number;
};

export default function RecentPanel({ maxItems = 4 }: Props) {
  const { history } = useNavigationHistory();

  // Remove current page (last item)
  const items = history.slice(0, -1).slice(-maxItems);

  if (items.length === 0) return null;

  return (
    <aside className={styles.panel} aria-label="Recent records">
      <div className={styles.title}>Recent</div>

      <ul className={styles.list}>
        {items.map((item, index) => (
          <li key={`${item.href}-${index}`}>
            <Link
              href={item.href}
              className={styles.link}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}