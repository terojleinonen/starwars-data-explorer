"use client";

import { Button, Surface } from "@/ui";
import styles from "../styles/PaginationBar.module.css";

type Props = { page: number; totalPages: number; onChange: (page: number) => void };

export default function PaginationBar({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  return (
    <nav aria-label="Archive pages" className={styles.wrap}>
      <Surface material="glass" elevation={1} padding="sm" className={styles.root}>
        <Button variant="quiet" disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Previous page">← Prev</Button>
        <div className={styles.pages}>
          {pages.map((number) => <Button key={number} variant={number === page ? "secondary" : "quiet"} iconOnly aria-current={number === page ? "page" : undefined} onClick={() => onChange(number)}>{String(number).padStart(2, "0")}</Button>)}
        </div>
        <Button variant="quiet" disabled={page === totalPages} onClick={() => onChange(page + 1)} aria-label="Next page">Next →</Button>
      </Surface>
    </nav>
  );
}
