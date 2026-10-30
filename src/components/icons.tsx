export function Arrow({ diagonal = false, className = "" }: { diagonal?: boolean; className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {diagonal ? <path d="M6 18 18 6M6 6h12v12" /> : <path d="M4 12h15m-6-6 6 6-6 6" />}
    </svg>
  );
}

export function OrbitMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="38" height="38" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="12" />
      <ellipse cx="20" cy="20" rx="19" ry="6" transform="rotate(-42 20 20)" />
      <path d="M20 3v5m0 24v5M3 20h5m24 0h5" />
      <circle className="orbit-center" cx="20" cy="20" r="2" />
    </svg>
  );
}
