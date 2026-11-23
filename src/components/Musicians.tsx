"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Mic } from "lucide-react";
import { wedding } from "@/config/wedding";
import { Reveal } from "./ui/Reveal";
import { Ornament } from "./ui/Ornament";
import { Curve } from "./ui/Curve";

// Deterministic waveform heights (0–1)
const BARS = Array.from({ length: 34 }, (_, i) => {
  const x = i / 33;
  const env = Math.sin(Math.PI * x);
  const v = 0.25 + 0.75 * env * (0.55 + 0.45 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6)));
  return Math.round(v * 100) / 100;
});

function Waveform() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden="true" className="flex h-24 items-center gap-[3px] sm:gap-1">
      {BARS.map((h, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-gradient-to-t from-gold-deep via-gold to-gold-light sm:w-1"
          style={{ height: `${h * 100}%` }}
          animate={reduce ? undefined : { scaleY: [1, 0.45 + (i % 5) * 0.08, 1] }}
          transition={{ duration: 1.6 + (i % 7) * 0.18, repeat: Infinity, ease: "easeInOut", delay: (i % 9) * 0.07 }}
        />
      ))}
    </div>
  );
}

export function Musicians() {
  const { musicians } = wedding;
  return (
    <section
      id="lautarii"
      aria-labelledby="lautarii-title"
      className="dark-satin grain relative isolate overflow-hidden px-5 pb-28 pt-32 sm:px-8 md:pb-36 md:pt-40"
    >
      <Curve fill="var(--color-ivory-2)" position="top" />
      {/* stage spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[700px] w-[1100px] max-w-[160vw] -translate-x-1/2 bg-[radial-gradient(ellipse_at_50%_20%,rgba(228,204,156,0.18),transparent_60%)]"
      />

      <Reveal className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="eyebrow text-gold-light/90">Seara de neuitat</p>
        <h2 id="lautarii-title" className="mt-4 font-script text-6xl text-gold-metal sm:text-7xl md:text-8xl">
          {musicians.title}
        </h2>
        <Ornament className="mt-5" tone="light" />
      </Reveal>

      <div className="mx-auto mt-16 flex max-w-5xl flex-col items-center justify-center gap-10 md:mt-20 lg:flex-row lg:gap-12">
        {musicians.artists.map((a, i) => (
          <div key={a.id} className={`contents`}>
            {i === 1 && (
              <Reveal delay={0.2} className="lg:px-2">
                <Waveform />
              </Reveal>
            )}
            <Reveal delay={0.15 * i} className="group flex flex-col items-center text-center">
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute -inset-3 rounded-full border border-gold/40 transition duration-700 group-hover:scale-105 group-hover:border-gold"
                />
                <div
                  aria-hidden="true"
                  className="absolute -inset-6 rounded-full border border-gold/15 transition duration-700 group-hover:scale-105"
                />
                <div className="relative h-48 w-48 overflow-hidden rounded-full border-2 border-gold/80 shadow-[0_0_60px_-10px_rgba(198,162,106,0.5)] sm:h-56 sm:w-56">
                  {a.photo ? (
                    <Image
                      src={a.photo}
                      alt={a.name}
                      fill
                      sizes="480px"
                      quality={90}
                      style={{ objectPosition: a.objectPosition }}
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-cocoa to-espresso">
                      <Mic size={28} strokeWidth={1.2} className="text-gold" aria-hidden="true" />
                      <span className="mt-2 font-script text-5xl text-gold-light">{a.initials}</span>
                    </div>
                  )}
                </div>
              </div>
              <h3 className="mt-9 font-serif text-3xl tracking-wide text-ivory sm:text-4xl">{a.name}</h3>
              <p className="eyebrow mt-2 !text-[0.6rem] text-gold/80">Muzică live</p>
            </Reveal>
          </div>
        ))}
      </div>

      <Reveal delay={0.3}>
        <p className="mx-auto mt-16 max-w-xl text-center font-serif text-2xl italic text-ivory/80 sm:text-3xl">
          „{musicians.tagline}”
        </p>
      </Reveal>
      <Curve fill="var(--color-ivory)" />
    </section>
  );
}
