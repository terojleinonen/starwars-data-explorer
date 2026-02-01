"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Breadcrumbs.module.css";

/* ======================================================
   Types
===================================================== */

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items?: BreadcrumbItem[];
};

/* ======================================================
   Separator glyph (1977 console style)
===================================================== */

function BreadcrumbSeparatorGlyph({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 6 8"
      width="6"
      height="8"
      aria-hidden="true"
      className={className}
    >
      <polygon points="1,1 5,4 1,7" />
    </svg>
  );
}

/* ======================================================
   Component
===================================================== */

export default function Breadcrumbs({ items }: Props) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      data-breadcrumbs
      className={styles.breadcrumbs}
    >
      <motion.ol
        layout
        initial={false}
        transition={{
          layout: {
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1],
          },
        }}
      >
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <motion.li
              key={item.label}
              layout
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.2 }}
              className={styles.item}
            >
              {item.href ? (
                <Link
                  href={item.href}
                  className={styles.link}
                  data-nav-label={item.label}
                >
                  {item.label}
                </Link>
              ) : (
                <span className={styles.current}>
                  {item.label}
                </span>
              )}

              {/* Separator (not after last item) */}
              {index < items.length - 1 && (
                <BreadcrumbSeparatorGlyph
                  className={styles.sep}
                />
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ol>
    </nav>
  );
}