"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Breadcrumbs.module.css";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items?: BreadcrumbItem[];
};

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
          {items.map((item) => (
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
                  data-nav-label={item.label}
                  className={styles.link}
                >
                  {item.label}
                </Link>
              ) : (
                <span className={styles.current}>
                  {item.label}
                </span>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ol>
    </nav>
  );
}