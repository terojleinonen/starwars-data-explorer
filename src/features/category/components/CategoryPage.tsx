"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "../styles//CategoryPage.module.css";
import { setNavContext } from "@/lib/navigation/navigationContext";
import { HoloCard } from "@/features/holo";

type Item = {
  id: string;
  name?: string;
  title?: string;
};

type Props = {
  category: string;
  title: string;
  fetchUrl: string;
};

export default function CategoryPage({ category, title, fetchUrl }: Props) {
  const [data, setData] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setNavContext(category, `/${category}`);

    async function load() {
      try {
        const res = await fetch(fetchUrl);
        const json = await res.json();

        const results = json.results.map((item: any) => ({
          ...item,
          id: item.url.match(/\/(\d+)\/?$/)?.[1],
        }));

        setData(results);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [category, fetchUrl]);

  const filtered = useMemo(() => {
    return data.filter((item) => {
      const label = item.name || item.title || "";
      return label.toLowerCase().includes(search.toLowerCase());
    });
  }, [data, search]);

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <div className={styles.header}>
        <h1>{title}</h1>
        <p>Browse and explore archived {title.toLowerCase()}</p>
      </div>

      {/* TOOLBAR */}
      <div className={styles.toolbar}>
        <input
          placeholder="Search records..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.search}
        />
      </div>

      {/* GRID */}
      {loading ? (
        <div className={styles.loading}>Scanning archive...</div>
      ) : (
        <div >
          {filtered.map((item) => {
            const title = item.name || item.title || "Unknown";

            return (
              <Link
                key={item.id}
                href={`/${category}/${item.id}`}
                className={styles.card}
              >
                <HoloCard category={category} title={title} subtitle={item.id} href={`/${category}/${item.id}`} />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}