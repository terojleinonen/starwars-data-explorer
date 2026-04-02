"use client";

import { useId, useMemo, useState } from "react";
import styles from "../styles/OpeningCrawl.module.css";

type Props = {
  text: string;
};

export default function OpeningCrawl({ text }: Props) {

  return (
    <section className={styles.root}>
      {text}
    </section>
  );
}