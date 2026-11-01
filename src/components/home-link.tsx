"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export default function HomeLink(props: {
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}) {
  return <Link {...props} href="/" prefetch={false} onNavigate={() => {
    // A link to the current route otherwise keeps its scroll position.
    if (window.location.pathname === "/") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }} />;
}
