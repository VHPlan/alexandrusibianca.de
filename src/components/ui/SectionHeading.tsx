import { Ornament } from "./Ornament";
import { Reveal } from "./Reveal";

type Props = {
  eyebrow?: string;
  title: string;
  script?: boolean;
  tone?: "dark" | "light";
  subtitle?: string;
  id?: string;
  className?: string;
};

/** Centered editorial section heading with eyebrow, title and gold ornament. */
export function SectionHeading({
  eyebrow,
  title,
  script = false,
  tone = "dark",
  subtitle,
  id,
  className = "",
}: Props) {
  const light = tone === "light";
  return (
    <Reveal className={`mx-auto flex max-w-3xl flex-col items-center text-center ${className}`}>
      {eyebrow && (
        <p className={`eyebrow mb-4 ${light ? "text-gold-light/90" : "text-gold-deep"}`}>{eyebrow}</p>
      )}
      <h2
        id={id}
        className={
          script
            ? `font-script text-5xl leading-[1.15] sm:text-6xl md:text-7xl ${light ? "text-gold-metal" : "text-gold-deep"}`
            : `font-serif text-4xl font-normal leading-tight tracking-wide sm:text-5xl md:text-6xl ${light ? "text-ivory" : "text-ink"}`
        }
      >
        {title}
      </h2>
      <Ornament className="mt-5" tone={light ? "light" : "gold"} />
      {subtitle && (
        <p
          className={`mt-5 max-w-xl font-serif text-lg italic sm:text-xl ${light ? "text-ivory/75" : "text-muted"}`}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
