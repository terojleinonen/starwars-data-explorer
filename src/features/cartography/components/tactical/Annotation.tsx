"use client";

import styles from "@/features/cartography/styles/Annotation.module.css";

type Props = {
  text: string
  x: number
  y: number
};

export default function Annotation({ text, x, y }: Props){
  return (
    <div
      className={styles.annotation}
      style={{
        left: x,
        top: y
      }}
    >
      {text}
    </div>
  )
}