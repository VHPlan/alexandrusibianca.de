import { IS_DEV } from "@/config/wedding";

/** Visible only during development — marks content that still awaits confirmation. */
export function DevBadge({ label = "Neconfirmat" }: { label?: string }) {
  if (!IS_DEV) return null;
  return (
    <span className="ml-2 inline-flex items-center rounded-full border border-dashed border-amber-600/60 bg-amber-50/80 px-2 py-0.5 align-middle font-sans text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-amber-800">
      {label}
    </span>
  );
}
