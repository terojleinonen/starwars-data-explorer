"use client";

import styles from "../styles/PaginationBar.module.css";

type Props = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export default function PaginationBar({
  page,
  totalPages,
  onChange,
}: Props) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={styles.root}>
      <button
        className={styles.nav}
        disabled={page === 1}
        onClick={() =>
          onChange(page - 1)
        }
      >
        ← Prev
      </button>

      <div className={styles.pages}>
        {Array.from({
          length: totalPages,
        }).map((_, i) => {
          const p = i + 1;

          return (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`${styles.page} ${
                p === page
                  ? styles.active
                  : ""
              }`}
            >
              {String(p).padStart(2, "0")}
            </button>
          );
        })}
      </div>

      <button
        className={styles.nav}
        disabled={page === totalPages}
        onClick={() =>
          onChange(page + 1)
        }
      >
        Next →
      </button>
    </div>
  );
}