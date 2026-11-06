"use client";

import Link from "next/link";
import { useMemoryLens, memoryPriority } from "@/components/memory-preferences";
import { usePathname } from "next/navigation";
import { categories } from "@/lib/archive/config";
import { categoryKeys } from "@/lib/archive/types";
import type { CSSProperties } from "react";

export default function ArchiveNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname();
  const {lens}=useMemoryLens();
  const ordered=[...categoryKeys].sort((a,b)=>memoryPriority(a,lens)-memoryPriority(b,lens));
  return <nav className="archive-nav" aria-label="Archive navigation">
    <span className="nav-heading">THE COLLECTION</span>
    {ordered.map(key=><Link onClick={onNavigate} key={key} href={`/${key}`} prefetch={false} style={{"--nav-accent":categories[key].accent} as CSSProperties} aria-current={path.startsWith(`/${key}`)?"page":undefined}><span>{categories[key].index}</span>{categories[key].label}<i>↗</i></Link>)}
    <span className="nav-heading nav-heading-secondary">FOLLOW THE THREADS</span>
    <Link onClick={onNavigate} href="/history" prefetch={false} aria-current={path==="/history"?"page":undefined}><span>◷</span>History atlas<i>↗</i></Link>
    <Link onClick={onNavigate} href="/galaxy" prefetch={false} aria-current={path==="/galaxy"?"page":undefined}><span>◉</span>Galactic atlas<i>↗</i></Link>
    <Link onClick={onNavigate} href="/war-room" prefetch={false} aria-current={path==="/war-room"?"page":undefined}><span>⌖</span>Rebel war map<i>↗</i></Link>
    <Link onClick={onNavigate} href="/research" prefetch={false}><span>◇</span>Research desk<i>↗</i></Link>
    <Link onClick={onNavigate} href="/investigate" prefetch={false}><span>◎</span>Connection explorer<i>↗</i></Link>
    <Link onClick={onNavigate} href="/timeline" prefetch={false} aria-current={path==="/timeline"?"page":undefined}><span>08</span>Release timeline<i>↗</i></Link>
    <Link onClick={onNavigate} href="/sources" style={{"--nav-accent":"#b8ade0"} as CSSProperties} prefetch={false} aria-current={path==="/sources"?"page":undefined}><span>09</span>Sources & provenance<i>↗</i></Link>
    <div className="nav-bottom"><span className="nav-status-dot"/>INDEPENDENT ARCHIVE<br/><small>One collection. Many connections.</small></div>
  </nav>;
}
