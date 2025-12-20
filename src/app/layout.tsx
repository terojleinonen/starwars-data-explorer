// FILE: app/layout.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import "../../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body>
        <Navbar theme="dark" />

        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, filter: "blur(6px)", y: 12 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            exit={{ opacity: 0, filter: "blur(6px)", y: -8 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            style={{ minHeight: "100vh" }}
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </body>
    </html>
  );
}