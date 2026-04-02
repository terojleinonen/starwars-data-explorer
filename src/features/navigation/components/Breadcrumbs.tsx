"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getContextFor } from "@/lib/navigation/navigationContext";
import styles from "../styles/Breadcrumbs.module.css";

const labelMap: Record<string, string> = {
  people: "People",
  planets: "Planets",
  starships: "Starships",
  films: "Films",
  species: "Species",
  vehicles: "Vehicles",
};

export default function Breadcrumbs() {
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [contextPath, setContextPath] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    const parts = pathname.split("/").filter(Boolean);
    const category = parts[0];

    if (category) {
      const ctx = getContextFor(category);
      setContextPath(ctx);
    }
  }, [pathname]);

  if (!mounted) return null;

  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return null;

  const category = parts[0];
  const id = parts[1];

  return (
    <div className={styles.wrapper}>
      {/* BACK TO CONTEXT */}
      {contextPath && (
        <Link href={contextPath} className={styles.back}>
          ← {labelMap[category] || "Back"}
        </Link>
      )}

      {/* BREADCRUMBS */}
      <div className={styles.crumbs}>
        <Link href="/" className={styles.crumb}>
          Home
        </Link>

        <span className={styles.sep}>/</span>

        <Link href={`/${category}`} className={styles.crumb}>
          {labelMap[category] || category}
        </Link>

        {id && (
          <>
            <span className={styles.sep}>/</span>
            <span className={styles.current}>{id}</span>
          </>
        )}
      </div>
    </div>
  );
}