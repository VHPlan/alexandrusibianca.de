import Image from "next/image";
import { CalendarHeart, Building2, Users, Video, Music } from "lucide-react";
import { wedding } from "@/config/wedding";
import { Reveal } from "./ui/Reveal";
import { Ornament } from "./ui/Ornament";
import { Curve } from "./ui/Curve";

const ICONS = {
  calendar: CalendarHeart,
  venue: Building2,
  users: Users,
  camera: Video,
  music: Music,
} as const;

export function WeddingDetails() {
  const { details } = wedding;
  return (
    <section
      id="detalii"
      aria-labelledby="detalii-title"
      className="grain relative isolate overflow-hidden bg-espresso px-5 pb-28 pt-32 sm:px-8 md:pb-36 md:pt-40"
    >
      <Curve fill="var(--color-ivory-2)" position="top" />
      <div className="absolute inset-0 -z-20">
        <Image
          src={details.background}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[70%_50%] opacity-80"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-espresso via-espresso/80 to-espresso/30"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-espresso via-transparent to-espresso/60"
      />

      <div className="relative mx-auto max-w-6xl">
        <Reveal className="max-w-xl text-center md:text-left">
          <p className="eyebrow text-gold-light/90">Tot ce trebuie să știți</p>
          <h2
            id="detalii-title"
            className="mt-4 font-serif text-5xl font-light leading-tight text-ivory sm:text-6xl md:text-7xl"
          >
            Detaliile <span className="font-script text-gold-metal">nunții</span>
          </h2>
          <Ornament className="mx-auto mt-5 md:mx-0" tone="light" />
          <div className="mt-8 flex items-center justify-center gap-4 md:justify-start">
            <div className="relative h-[67px] w-[164px] overflow-hidden rounded-full border border-gold/40 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)]">
              <Image
                src={details.accentImage.src}
                alt="Verighete din aur"
                width={details.accentImage.width}
                height={details.accentImage.height}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="max-w-[16rem] text-left font-serif text-lg italic text-ivory/70">
              O zi de toamnă, o promisiune pentru o viață.
            </p>
          </div>
        </Reveal>

        {/* Modern editorial 3 + 2 bento grid */}
        <ul className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-20 lg:grid-cols-6 lg:gap-5">
          {details.items.map((item, i) => {
            const Icon = ICONS[item.icon];
            const spanClass =
              i < 3
                ? "lg:col-span-2"
                : i === 3
                  ? "lg:col-span-3"
                  : "sm:col-span-2 lg:col-span-3";
            return (
              <Reveal as="li" key={item.key} delay={0.07 * i} className={`group relative ${spanClass}`}>
                <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-gold/20 bg-[linear-gradient(155deg,rgba(47,35,27,0.72)_0%,rgba(24,16,11,0.86)_100%)] p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.95)] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-gold/55 hover:shadow-[0_28px_65px_-25px_rgba(198,162,106,0.28)] sm:p-7">
                  {/* Top gold hairline sheen */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold/65 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  {/* Soft ambient hover glow */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-gold/10 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />

                  <div className="relative flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/35 bg-espresso/70 text-gold-light shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors duration-500 group-hover:border-gold/75 group-hover:bg-gold/15">
                      <Icon size={20} strokeWidth={1.35} aria-hidden="true" />
                    </span>
                    <span
                      aria-hidden="true"
                      className="font-serif text-lg tracking-[0.2em] text-gold/35 transition-colors duration-500 group-hover:text-gold/70"
                    >
                      0{i + 1}
                    </span>
                  </div>

                  <div className="relative mt-7">
                    <div className="flex items-center gap-2.5">
                      <span aria-hidden="true" className="h-px w-5 bg-gold/65" />
                      <h3 className="font-sans text-[0.66rem] font-medium uppercase tracking-[0.28em] text-gold-light/80">
                        {item.label}
                      </h3>
                    </div>
                    <p className="mt-2.5 font-serif text-2xl font-light leading-snug tracking-wide text-ivory sm:text-[1.7rem]">
                      {item.value}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
      <Curve fill="var(--color-ivory)" />
    </section>
  );
}
