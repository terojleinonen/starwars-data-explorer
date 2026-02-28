"use client"

import { useEffect, useState } from "react"
import styles from "@/features/landing/styles/CommandTelemetry.module.css"

const messages = [
  "NAV GRID CALIBRATED",
  "DATA RELAY SYNCHRONIZED",
  "SWAPI DATASTREAM STABLE",
  "HYPERSPACE ROUTES MAPPED",
  "GALACTIC ARCHIVE ONLINE"
]

export default function CommandTelemetry() {

  const [index,setIndex] = useState(0)

  useEffect(()=>{

    const id = setInterval(()=>{
      setIndex(i => (i + 1) % messages.length)
    },4000)

    return () => clearInterval(id)

  },[])

  return (
    <div className={styles.telemetry}>
      {messages[index]}
    </div>
  )
}