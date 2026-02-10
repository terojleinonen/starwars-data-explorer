"use client";

import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
};

export default function AnimatedCardGrid({ children }: Props) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: 2.2,
          },
        },
      }}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "1.2rem",
      }}
    >
      {children}
    </motion.div>
  );
}