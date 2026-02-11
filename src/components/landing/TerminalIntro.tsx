"use client";

import { useEffect, useState } from "react";
import styles from "./TerminalIntro.module.css";

const LINES = [
  "Connecting to SWAPI...",
  "Loading galactic sectors...",
  "Compiling star records...",
  "System ready."
];

export default function TerminalIntro({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= LINES.length) {
      onDone();
      return;
    }

    const t = setTimeout(() => setIndex(i => i + 1), 900);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div className={styles.terminal}>
      {LINES.slice(0, index).map(l => (
        <div key={l}>{l}</div>
      ))}
    </div>
  );
}