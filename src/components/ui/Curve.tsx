type Props = {
  /** Fill colour of the curve (colour of the *next* section). */
  fill: string;
  position?: "top" | "bottom";
  className?: string;
  variant?: "arc" | "wave";
};

/** Organic curved edge used to transition between sections. */
export function Curve({ fill, position = "bottom", className = "", variant = "arc" }: Props) {
  const d =
    variant === "arc"
      ? "M0 80 C 360 0 1080 0 1440 80 L1440 81 L0 81 Z"
      : "M0 60 C 240 20 480 0 720 30 C 960 60 1200 50 1440 20 L1440 81 L0 81 Z";
  return (
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`pointer-events-none absolute left-0 z-10 block h-10 w-full sm:h-16 md:h-20 ${
        position === "bottom" ? "bottom-[-1px]" : "top-[-1px] rotate-180"
      } ${className}`}
    >
      <path d={d} fill={fill} />
    </svg>
  );
}
