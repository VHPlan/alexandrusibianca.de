"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { Church, Camera, GlassWater, Music, CakeSlice, Clock } from "lucide-react";
import { wedding } from "@/config/wedding";
import { Reveal } from "./ui/Reveal";
import { Ornament } from "./ui/Ornament";
import { DevBadge } from "./ui/Badges";
import { Curve } from "./ui/Curve";

const ICONS = { church: Church, camera: Camera, glass: GlassWater, music: Music, cake: CakeSlice } as const;

export function Timeline() {
  const { timeline } = wedding;
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 25, mass: 0.4 });

  return (
    <section
      id="program"
      aria-labelledby="program-title"
      className="dark-satin grain relative isolate overflow-hidden px-5 pb-28 pt-32 sm:px-8 md:pb-36 md:pt-40"
    >
      <Curve fill="var(--color-ivory)" position="top" />
      <div className="relative mx-auto grid max-w-6xl gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
        {/* Left: heading + cinematic image */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal className="text-center lg:text-left">
            <p className="eyebrow text-gold-light/90">15 Octombrie 2027</p>
            <h2
              id="program-title"
              className="mt-4 font-serif text-5xl font-light leading-tight text-ivory sm:text-6xl"
            >
              Programul <span className="block font-script text-6xl text-gold-metal sm:text-7xl">evenimentului</span>
            </h2>
            <Ornament className="mx-auto mt-5 lg:mx-0" tone="light" />
          </Reveal>
          <Reveal delay={0.2} className="relative mx-auto mt-12 max-w-[440px] lg:mx-0">
            <div aria-hidden="true" className="absolute -inset-3 rounded-[26px] border border-gold/35" />
            <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]">
              <Image
                src={timeline.image.src}
                alt={timeline.image.alt}
                fill
                sizes="(min-width: 1024px) 440px, 90vw"
                className="object-cover"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-transparent to-transparent" />
            </div>
          </Reveal>
        </div>

        {/* Right: timeline */}
        <ol ref={listRef} className="relative ml-2 sm:ml-4" aria-label="Programul zilei">
          <span aria-hidden="true" className="absolute bottom-6 left-[27px] top-6 w-px bg-gold/15" />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: reduce ? 1 : scaleY }}
            className="absolute bottom-6 left-[27px] top-6 w-px origin-top bg-gradient-to-b from-gold-light via-gold to-gold-deep"
          />
          {timeline.events.map((ev, i) => {
            const Icon = ICONS[ev.icon as keyof typeof ICONS];
            return (
              <Reveal as="li" key={ev.id} delay={0.05 * i} x={24} y={0} className="relative flex gap-6 pb-12 last:pb-0 sm:gap-8">
                <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold/60 bg-espresso text-gold-light shadow-[0_0_0_6px_rgba(26,18,13,1),0_0_30px_-5px_rgba(198,162,106,0.45)]">
                  <Icon size={22} strokeWidth={1.25} aria-hidden="true" />
                </span>
                <div className="pt-1">
                  <p className="flex flex-wrap items-center gap-y-1 font-sans text-xs uppercase tracking-[0.25em] text-gold">
                    <Clock size={13} strokeWidth={1.5} className="mr-2" aria-hidden="true" />
                    {ev.time && ev.confirmed ? ev.time : "Ora va fi anunțată"}
                    {!ev.confirmed && <DevBadge />}
                  </p>
                  <h3 className="mt-2 font-serif text-3xl text-ivory sm:text-[2rem]">{ev.title}</h3>
                  <p className="mt-2 max-w-md font-serif text-lg leading-relaxed text-ivory/65">
                    {ev.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
      <Curve fill="var(--color-ivory-2)" />
    </section>
  );
}
