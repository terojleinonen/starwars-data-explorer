import type { Category } from "@/lib/archive/types";

export type ArchiveDepartment = "screen" | "person" | "world" | "craft" | "source";

export function departmentFor(category: Category): ArchiveDepartment {
  if (category === "people") return "person";
  if (category === "planets" || category === "species") return "world";
  if (category === "starships" || category === "vehicles") return "craft";
  return "screen";
}

const paths: Record<ArchiveDepartment, React.ReactNode> = {
  screen: <><rect x="3" y="4" width="18" height="14" rx="1"/><path d="M8 21h8M9 8l6 3-6 3Z"/></>,
  person: <><circle cx="12" cy="8" r="3"/><path d="M5 21v-3a7 7 0 0 1 14 0v3M3 3h4M3 3v4M21 3h-4M21 3v4"/></>,
  world: <><circle cx="12" cy="12" r="7"/><ellipse cx="12" cy="12" rx="11" ry="3" transform="rotate(-30 12 12)"/></>,
  craft: <><path d="m12 2 4 10 6 5-8-1-2 6-2-6-8 1 6-5ZM12 7v9"/></>,
  source: <><path d="M6 3h9l4 4v14H6ZM14 3v5h5M9 12h7M9 16h5"/></>,
};
const labels: Record<ArchiveDepartment, string> = {
  screen: "Screen archive", person: "Personnel", world: "Worlds & life", craft: "Fleet & vehicles", source: "Sources",
};

export default function ArchiveLabel({ type, label }: { type: ArchiveDepartment; label?: string }) {
  return <span className="archive-type-label" data-department={type}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[type]}</svg>
    <span>{label ?? labels[type]}</span>
  </span>;
}

export function ArchiveKey() {
  return <aside className="archive-key" aria-label="Archive colour key">
    <span className="archive-key-title">ARCHIVE INDEX</span>
    <ul>{(Object.keys(labels) as ArchiveDepartment[]).map(type => <li key={type}><ArchiveLabel type={type}/></li>)}</ul>
  </aside>;
}
