import React from "react";
import styles from "../styles/CommandPulse.module.css";

export type CommandPulseProps = {
  theme: "dark" | "light";
  density?: "low" | "medium" | "high";
  intensity?: "subtle" | "normal" | "strong";
  className?: string;
};

const densityToRings: Record<NonNullable<CommandPulseProps["density"]>, number> = {
  low: 4,
  medium: 6,
  high: 8,
};

export default function CommandPulse({
  theme,
  density = "medium",
  intensity = "normal",
  className,
}: CommandPulseProps) {
  const rings = densityToRings[density];

  return (
    <div
      className={[
        styles.root,
        theme === "dark" ? styles.dark : styles.light,
        styles[intensity],
        className ?? "",
      ].join(" ")}
      aria-hidden="true"
    >
      {/* subtle animated grain/noise */}
      <div className={styles.noise} />

      {/* radial rings */}
      <div className={styles.rings}>
        {Array.from({ length: rings }).map((_, i) => (
          <span
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            className={styles.ring}
            style={{ ["--i" as any]: i + 1 }}
          />
        ))}
      </div>

      {/* sweeping wedge (radar sweep) */}
      <div className={styles.sweep} />

      {/* scanlines */}
      <div className={styles.scanlines} />

      {/* small “blips” drifting (gives life without being distracting) */}
      <div className={styles.blips}>
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className={styles.blip} style={{ ["--b" as any]: i + 1 }} />
        ))}
      </div>

      {/* vignette to focus the hero area */}
      <div className={styles.vignette} />
    </div>
  );
}