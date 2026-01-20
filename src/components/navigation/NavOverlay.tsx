"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./NavOverlay.module.css";

const CATEGORIES = [
  { key: "people", label: "People" },
  { key: "films", label: "Films" },
  { key: "planets", label: "Planets" },
  { key: "starships", label: "Starships" },
  { key: "vehicles", label: "Vehicles" },
  { key: "species", label: "Species" },
];

type Props = {
  onClose: () => void;
};

export default function NavOverlay({ onClose }: Props) {
  const pathname = usePathname();

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <nav className={styles.menu}>
        {CATEGORIES.map((cat) => {
          const active = pathname.startsWith(`/${cat.key}`);

          return (
            <Link
              key={cat.key}
              href={`/${cat.key}`}
              className={`${styles.link} ${active ? styles.active : ""}`}
              onClick={onClose}
            >
              {cat.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}