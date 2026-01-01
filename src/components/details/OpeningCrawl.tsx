"use client";

import { useId, useState } from "react";
import styles from "./OpeningCrawl.module.css";

type Props = {
  text: string;
};

export default function OpeningCrawl({ text }: Props) {
  const [open, setOpen] = useState(false);

  // Stable unique id per component instance (avoids duplicate ids)
  const reactId = useId();
  const panelId = `opening-crawl-panel-${reactId}`;

  return (
    <section className={styles.crawl}>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span className={styles.label}>Opening Crawl</span>
        <span className={styles.icon}>{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div id={panelId} className={styles.panel}>
          <p className={styles.text}>{text}</p>
        </div>
      )}
    </section>
  );
}