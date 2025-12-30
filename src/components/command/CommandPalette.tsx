"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./CommandPalette.module.css";
import type { CommandItem } from "./CommandPaletteContext";
import { getCachedItems } from "@/data/swapiCache";

type Props = {
  items: CommandItem[];
  onSelect: (href: string) => void;
  onClose: () => void;
};

export default function CommandPalette({
  items,
  onSelect,
  onClose,
}: Props) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const allItems = getCachedItems();

  const results = useMemo(() => {
    if (!query) return items.slice(0, 12);
    const q = query.toLowerCase();
    return items
      .filter((i) =>
        i.label.toLowerCase().includes(q)
      )
      .slice(0, 12);
  }, [query, items]);

  useEffect(() => {
    setIndex(0);
  }, [query]);

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) =>
        Math.min(i + 1, results.length - 1)
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    }

    if (e.key === "Enter") {
      const item = results[index];
      if (item) onSelect(item.href);
    }

    if (e.key === "Escape") {
      onClose();
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.panel}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          className={styles.input}
          placeholder="Search the galaxy…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKey}
        />

        <div className={styles.results}>
          {results.map((item, i) => (
            <div
              key={item.id}
              className={`${styles.item} ${
                i === index ? styles.active : ""
              }`}
              onMouseEnter={() => setIndex(i)}
              onClick={() => onSelect(item.href)}
            >
              <span className={styles.label}>
                {item.label}
              </span>
              <span className={styles.meta}>
                {item.category}
              </span>
            </div>
          ))}

          {results.length === 0 && (
            <div className={styles.empty}>
              No results
            </div>
          )}
        </div>
      </div>
    </div>
  );
}