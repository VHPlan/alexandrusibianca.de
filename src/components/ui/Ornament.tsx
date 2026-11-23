type OrnamentProps = { className?: string; tone?: "gold" | "light" };

/** Fine gold separator: hairline — flourish — diamond — flourish — hairline */
export function Ornament({ className = "", tone = "gold" }: OrnamentProps) {
  const c = tone === "gold" ? "#c6a26a" : "#e4cc9c";
  return (
    <svg
      viewBox="0 0 240 20"
      className={`h-4 w-48 sm:w-60 ${className}`}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`orn-l-${tone}`} gradientUnits="userSpaceOnUse" x1="0" y1="10" x2="92" y2="10">
          <stop offset="0" stopColor={c} stopOpacity="0" />
          <stop offset="1" stopColor={c} />
        </linearGradient>
        <linearGradient id={`orn-r-${tone}`} gradientUnits="userSpaceOnUse" x1="240" y1="10" x2="148" y2="10">
          <stop offset="0" stopColor={c} stopOpacity="0" />
          <stop offset="1" stopColor={c} />
        </linearGradient>
      </defs>
      <line x1="0" y1="10" x2="92" y2="10" stroke={`url(#orn-l-${tone})`} strokeWidth="0.8" />
      <line x1="148" y1="10" x2="240" y2="10" stroke={`url(#orn-r-${tone})`} strokeWidth="0.8" />
      <path
        d="M94 10c6-6 12-6 16 0-4 6-10 6-16 0Zm52 0c-6-6-12-6-16 0 4 6 10 6 16 0Z"
        stroke={c}
        strokeWidth="0.8"
      />
      <path d="M120 3l5 7-5 7-5-7 5-7Z" fill={c} />
      <circle cx="120" cy="10" r="1.3" fill="#fff8ea" />
    </svg>
  );
}

/** Two interlocked rings line-icon used as ornament. */
export function RingsIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 28" className={className} fill="none" aria-hidden="true">
      <circle cx="18" cy="15" r="10" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="30" cy="15" r="10" stroke="currentColor" strokeWidth="1.4" />
      <path d="M30 2.5l2 2.3-2 2.2-2-2.2 2-2.3Z" fill="currentColor" />
    </svg>
  );
}
