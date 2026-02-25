"use client";

import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";

/**
 * NavLink
 * --------
 * Enforces a clean navigation contract:
 * - Every navigation MUST declare a human-readable label
 * - Navigation history never guesses from DOM text
 */
type NavLinkProps = LinkProps & {
  /** Human-readable navigation label (used for breadcrumbs & history) */
  label: string;
  children: ReactNode;
  className?: string;
};

export default function NavLink({
  label,
  children,
  className,
  ...props
}: NavLinkProps) {
  return (
    <Link
      {...props}
      className={className}
      data-nav-label={label}
    >
      {children}
    </Link>
  );
}