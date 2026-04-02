"use client";

import { useState } from "react";
import styles from "../styles/DetailsTabs.module.css";

type Tab = "overview" | "relations" | "meta";

type Props = {
  overview: React.ReactNode;
  relations: React.ReactNode;
  meta: React.ReactNode;
};

export default function DetailsTabs({
  overview,
  relations,
  meta,
}: Props) {
  const [active, setActive] = useState<Tab>("overview");

  return (
    <div className={styles.wrapper}>
      {/* TAB BAR */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            active === "overview" ? styles.active : ""
          }`}
          onClick={() => setActive("overview")}
        >
          Overview
        </button>

        <button
          className={`${styles.tab} ${
            active === "relations" ? styles.active : ""
          }`}
          onClick={() => setActive("relations")}
        >
          Relations
        </button>

        <button
          className={`${styles.tab} ${
            active === "meta" ? styles.active : ""
          }`}
          onClick={() => setActive("meta")}
        >
          Meta
        </button>
      </div>

      {/* CONTENT */}
      <div className={styles.content}>
        {active === "overview" && overview}
        {active === "relations" && relations}
        {active === "meta" && meta}
      </div>
    </div>
  );
}