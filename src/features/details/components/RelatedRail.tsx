"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchRelated } from "@/lib/swapi/swapiRelated";
import styles from "../styles/RelatedRail.module.css";

type Props = {
  title: string;
  urls: string[];
  category: string;
};

export default function RelatedRail({ title, urls, category }: Props) {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!urls || urls.length === 0) return;

    fetchRelated(urls).then(setItems);
  }, [urls]);

  if (!items.length) return null;

  return (
    <div className={styles.section}>
      <h3>{title}</h3>

      <div className={styles.rail}>
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/${category}/${item.id}`}
            className={styles.card}
          >
            <div className={styles.glow} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}