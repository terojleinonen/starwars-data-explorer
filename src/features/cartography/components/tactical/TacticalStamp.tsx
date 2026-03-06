"use client";

import styles from "@/features/cartography/styles/TacticalStamp.module.css";

type Props = {
  text: string
  x?: number
  y?: number
  rotation?: number
};

export default function TacticalStamp({
  text,
  x = 300,
  y = 200,
  rotation = -12
}: Props){

  return (

    <div
      className={styles.stamp}
      style={{
        left: x,
        top: y,
        transform: `rotate(${rotation}deg)`
      }}
    >

      {text}

    </div>

  )

}