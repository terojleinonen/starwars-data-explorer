"use client";

import { useId, useMemo, useState } from "react";
import styles from "./OpeningCrawl.module.css";

type Props = {
  text: string;
};

/* -----------------------------------------------
   Adaptive timing config
----------------------------------------------- */

// Tuned for readability
const MIN_DURATION = 22; // seconds (short crawls)
const MAX_DURATION = 55; // seconds (long crawls)

// Rough reading-speed heuristic
const CHARS_PER_SECOND = 14;

export default function OpeningCrawl({ text }: Props) {
  const [open, setOpen] = useState(false);
  const reactId = useId();
  const panelId = `opening-crawl-panel-${reactId}`;

  // Compute duration once per text change
  const duration = useMemo(() => {
    const estimated =
      text.length / CHARS_PER_SECOND;

    return Math.min(
      MAX_DURATION,
      Math.max(MIN_DURATION, estimated)
    );
  }, [text]);

  return (
    <section className={styles.crawl}>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span className={styles.label}>
          Opening Crawl
        </span>
        <span className={styles.icon}>
          {open ? "−" : "+"}
        </span>
      </button>

      {open && (
        <div
          id={panelId}
          className={styles.viewport}
          style={
            {
              // Pass duration to CSS
              ["--crawl-duration" as any]:
                `${duration}s`,
            } as React.CSSProperties
          }
        >
          <div className={styles.fadeTop} />
          <div className={styles.fadeBottom} />

          <div className={styles.crawlInner}>
            <p className={styles.text}>
              {text}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}