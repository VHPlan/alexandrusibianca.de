import Image from "next/image";

type Props = { size?: "sm" | "md" | "lg"; className?: string };

const DIMS = {
  sm: "h-14 w-[84px] sm:h-[74px] sm:w-[112px] lg:h-[84px] lg:w-[126px]",
  md: "h-24 w-[144px]",
  lg: "h-32 w-[192px] sm:h-36 sm:w-[216px]",
} as const;

const SIZES = {
  sm: "126px",
  md: "144px",
  lg: "216px",
} as const;

/** Royal A&B wedding crest monogram. */
export function Monogram({ size = "sm", className = "" }: Props) {
  return (
    <span className={`relative inline-block shrink-0 ${DIMS[size]} ${className}`}>
      <Image
        src="/images/wedding/logo-ab.png"
        alt="Alex & Bianca — A&B"
        fill
        sizes={SIZES[size]}
        className="object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)]"
        preload={size === "sm"}
      />
    </span>
  );
}
