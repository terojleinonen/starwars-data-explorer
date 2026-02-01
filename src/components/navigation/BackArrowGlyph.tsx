export function BackArrowGlyph({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 8"
      width="24"
      height="8"
      aria-hidden="true"
      className={className}
    >
      {/* Shaft */}
      <rect x="6" y="3.25" width="17" height="1.5" />

      {/* Arrow head */}
      <polygon points="6,1 1,4 6,7" />
    </svg>
  );
}