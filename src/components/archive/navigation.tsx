"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/lib/archive/config";
import { categoryKeys } from "@/lib/archive/types";
import type { CSSProperties } from "react";

export default function ArchiveNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname();
  return <nav className="archive-nav" aria-label="Archive navigation">
    <span className="nav-heading">THE COLLECTION</span>
    {categoryKeys.map(key=><Link onClick={onNavigate} key={key} href={`/${key}`} prefetch={false} style={{"--nav-accent":categories[key].accent} as CSSProperties} aria-current={path.startsWith(`/${key}`)?"page":undefined}><span>{categories[key].index}</span>{categories[key].label}<i>↗</i></Link>)}
    <span className="nav-heading nav-heading-secondary">FOLLOW THE THREADS</span>
    <Link onClick={onNavigate} href="/timeline" prefetch={false} aria-current={path==="/timeline"?"page":undefined}><span>08</span>Release timeline<i>↗</i></Link>
    <Link onClick={onNavigate} href="/sources" style={{"--nav-accent":"#b8ade0"} as CSSProperties} prefetch={false} aria-current={path==="/sources"?"page":undefined}><span>09</span>Sources & provenance<i>↗</i></Link>
    <div className="nav-bottom"><span className="nav-status-dot"/>INDEPENDENT ARCHIVE<br/><small>One collection. Many connections.</small></div>
  </nav>;
}
