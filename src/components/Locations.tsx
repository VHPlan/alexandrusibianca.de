import Image from "next/image";
import { Clock, MapPin, Navigation } from "lucide-react";
import { wedding } from "@/config/wedding";
import { SectionHeading } from "./ui/SectionHeading";
import { Reveal } from "./ui/Reveal";
import { DevBadge } from "./ui/Badges";

function mapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function Locations() {
  return (
    <section
      id="locatii"
      aria-labelledby="locatii-title"
      className="relative overflow-hidden bg-ivory-2 px-5 py-24 sm:px-8 md:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/3 h-[480px] w-[480px] rounded-full bg-champagne/60 blur-3xl"
      />
      <SectionHeading id="locatii-title" eyebrow="Unde ne vedem" title="Locații" script />

      <div className="relative mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-10 md:mt-20 md:grid-cols-2 lg:gap-12">
        {wedding.locations.map((loc, i) => (
          <Reveal as="article" key={loc.id} delay={0.15 * i} className="group min-w-0" aria-labelledby={`loc-${loc.id}`}>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[26px] border border-gold/30 bg-white/85 shadow-[0_30px_70px_-35px_rgba(80,55,30,0.5)] transition duration-700 hover:-translate-y-1 hover:shadow-[0_40px_80px_-30px_rgba(120,85,45,0.55)]">
              <div className="relative h-60 overflow-hidden sm:h-72">
                <Image
                  src={loc.image.src}
                  alt={loc.name.value ?? loc.kind}
                  fill
                  quality={90}
                  sizes="(min-width: 768px) 560px, 95vw"
                  className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-[1.04]"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                <span className="eyebrow absolute bottom-4 left-5 !text-[0.65rem] text-white/95">{loc.kind}</span>
                {loc.time && (
                  <span className="absolute bottom-3.5 right-4 inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-espresso/80 px-3.5 py-1 font-serif text-base tracking-[0.14em] text-gold-light backdrop-blur-sm">
                    <Clock size={13} strokeWidth={1.6} aria-hidden="true" />
                    {loc.time}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col items-center px-6 pb-9 pt-8 text-center sm:px-10">
                <h3 id={`loc-${loc.id}`} className="font-serif text-3xl text-ink sm:text-4xl">
                  {loc.name.value ?? loc.namePending}
                  {!loc.name.confirmed && <DevBadge />}
                </h3>
                <div className="mt-4 h-px w-16 bg-gold/60" aria-hidden="true" />
                <address className="mt-5 flex flex-col items-center gap-1 font-serif text-lg not-italic text-muted">
                  <span className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-ink/90">
                    <MapPin size={16} strokeWidth={1.5} className="text-gold-deep" aria-hidden="true" />
                    {loc.address.value ?? "Adresa exactă va fi comunicată"}
                    {!loc.address.confirmed && <DevBadge />}
                  </span>
                  <span>{loc.city.value ?? "Localitatea va fi confirmată"}</span>
                  {loc.note && (
                    <span className="mt-1.5 font-serif text-base italic text-gold-deep/90">{loc.note}</span>
                  )}
                </address>
                <div className="mt-auto pt-8">
                  {loc.mapsQuery ? (
                    <a
                      href={mapsUrl(loc.mapsQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold"
                    >
                      <Navigation size={15} strokeWidth={1.6} aria-hidden="true" />
                      Vezi pe hartă
                      <span className="sr-only">(se deschide într-o filă nouă)</span>
                    </a>
                  ) : (
                    <span
                      className="btn-outline-gold cursor-default text-center opacity-70 hover:!bg-transparent hover:!text-gold-deep"
                      aria-disabled="true"
                    >
                      <Navigation size={15} strokeWidth={1.6} aria-hidden="true" />
                      Harta va fi disponibilă în curând
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
