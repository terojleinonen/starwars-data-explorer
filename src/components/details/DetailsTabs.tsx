"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./DetailsTabs.module.css";

type TabId = "overview" | "related";

type Props = {
  relatedReady: boolean;
  overview: React.ReactNode;
  related: React.ReactNode;
};

export default function DetailsTabs({
  relatedReady,
  overview,
  related,
}: Props) {
  const [active, setActive] = useState<TabId>("overview");

  return (
    <>
      {/* Tabs header (desktop / tablet only) */}
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
            active === "related" ? styles.active : ""
          }`}
          onClick={() => setActive("related")}
        >
          Related
          {!relatedReady && (
            <span className={styles.dot} />
          )}
        </button>
      </div>

      {/* Tab content */}
      <div className={styles.panel}>
        <AnimatePresence mode="wait">
          {active === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              {overview}
            </motion.div>
          )}

          {active === "related" && (
            <motion.div
              key="related"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              {related}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}