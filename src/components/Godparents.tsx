import Image from "next/image";
import { SATIN_BG, wedding } from "@/config/wedding";
import { SectionHeading } from "./ui/SectionHeading";
import { Reveal } from "./ui/Reveal";

function PortraitPlaceholder({ initials }: { initials: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_50%_35%,#fffaf1_0%,#f1e5cf_55%,#e2cfac_100%)]">
      <svg
        viewBox="0 0 120 60"
        className="absolute top-[14%] h-10 w-24 text-gold/70"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M60 50C60 30 45 18 28 16M60 50C60 30 75 18 92 16M28 16c6 6 6 12 0 16M92 16c-6 6-6 12 0 16M46 22c-4-6-2-12 4-14M74 22c4-6 2-12-4-14"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <circle cx="60" cy="52" r="2" fill="currentColor" />
      </svg>
      <span className="font-script text-5xl text-gold-deep sm:text-6xl">{initials}</span>
      <span className="eyebrow mt-4 !text-[0.58rem] !tracking-[0.3em] text-gold-deep/80">
        Fotografie în curând
      </span>
    </div>
  );
}

export function Godparents() {
  return (
    <section
      id="nasii"
      aria-labelledby="nasii-title"
      className="relative isolate overflow-hidden bg-ivory px-5 py-24 sm:px-8 md:py-32"
    >
      <div className="absolute inset-0 -z-10 opacity-60">
        <Image src={SATIN_BG} alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ivory/50" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,var(--color-ivory)_0%,transparent_16%,transparent_84%,var(--color-ivory)_100%)]"
      />

      <SectionHeading
        id="nasii-title"
        eyebrow="Cu recunoștință"
        title="Nașii noștri"
        script
        subtitle="Alături de noi, pe drumul cel nou, ne vor călăuzi cu dragoste și înțelepciune."
      />

      <ul className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-14 sm:grid-cols-2 md:mt-20 lg:gap-16">
        {wedding.godparents.map((g, i) => (
          <Reveal
            as="li"
            key={g.id}
            delay={0.12 * i}
            className="group flex flex-col items-center"
          >
            <figure className="flex w-full max-w-[250px] flex-col items-center sm:max-w-[300px]">
              <div className="relative w-full transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-2">
                {/* outer ornamental frame */}
                <div
                  aria-hidden="true"
                  className="absolute -inset-3 rounded-t-[999px] rounded-b-[28px] border border-gold/50 transition-colors duration-700 group-hover:border-gold"
                />
                <div
                  aria-hidden="true"
                  className="absolute -inset-[18px] rounded-t-[999px] rounded-b-[32px] border border-gold/20"
                />
                <div className="relative aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-[22px] border-[3px] border-white shadow-[0_30px_60px_-30px_rgba(90,60,30,0.5)] transition-shadow duration-700 group-hover:shadow-[0_40px_70px_-25px_rgba(156,122,69,0.55)]">
                  {g.photo ? (
                    <Image
                      src={g.photo}
                      alt={`Nașii ${g.names}`}
                      fill
                      sizes="800px"
                      quality={90}
                      style={{ objectPosition: g.objectPosition }}
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  ) : (
                    <PortraitPlaceholder initials={g.initials} />
                  )}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/0 opacity-0 transition duration-700 group-hover:via-white/25 group-hover:opacity-100"
                  />
                </div>
                {/* diamond accent */}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-[22px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border border-gold bg-ivory"
                />
              </div>
              <figcaption className="mt-10 text-center">
                <span className="font-script text-4xl text-gold-deep sm:text-[2.6rem]">{g.names}</span>
                <span className="eyebrow mt-2 block !text-[0.6rem] text-muted">Nași</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
