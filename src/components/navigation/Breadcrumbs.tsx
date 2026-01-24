"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { truncateBreadcrumbs } from "@/components/navigation/truncateBreadcrumbs";
import styles from "./Breadcrumbs.module.css";

export type BreadcrumbItem = {
  label: string;
  href?: string;
  action?: "back";
};

type Props = {
  items: BreadcrumbItem[];
};


export default function Breadcrumbs({ items }: Props) {
  if (!items || items.length === 0) return null;

  const visibleItems = truncateBreadcrumbs(items);

  return (
    <nav
      aria-label="Breadcrumb"
      data-breadcrumbs
      className={styles.breadcrumbs}
    >
      <motion.ol layout>
        <AnimatePresence mode="popLayout">
          {visibleItems.map((item, index) => (
            <motion.li
              key={`${item.label}-${index}`}
              layout
              className={styles.item}
            >
              {item.href ? (
                <Link
                  href={item.href}
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