"use client";

import styles from "./RelatedPanel.module.css";

type Props = {
  children: React.ReactNode;
};

export default function RelatedPanel({ children }: Props) {
  return (
    <section className={styles.panel}>
      <h3 className={styles.heading}>
        Related Records
      </h3>

      <div className={styles.content}>
        {children}
      </div>
    </section>
  );
}