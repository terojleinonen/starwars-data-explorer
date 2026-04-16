"use client";

import styles from "../styles/PageWrapper.module.css";

type Props = {
  children: React.ReactNode;
  wide?: boolean;     // for dashboards / timeline
};

export const PageWrapper = ({ children, wide }: Props) => {
  return (
    <div className={styles.root}>
      <div className={`${styles.container} ${wide ? styles.wide : ""}`}>
        {children}
      </div>
    </div>
  );
};