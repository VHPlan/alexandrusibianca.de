"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { wedding } from "@/config/wedding";
import { Reveal } from "./ui/Reveal";
import { Ornament } from "./ui/Ornament";

export function LoveStory() {
  const { story } = wedding;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ["0px", "0px"] : ["24px", "-24px"]);

  return (
    <section
      id="poveste"
      ref={ref}
      aria-labelledby="poveste-title"
      className="relative overflow-hidden bg-ivory-2 px-5 pb-28 pt-16 sm:px-8 md:pb-40 md:pt-24"
    >
      {/* Ambient warm champagne glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-44 top-6 h-[540px] w-[540px] rounded-full bg-champagne/55 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-10 h-[420px] w-[420px] rounded-full bg-gold/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-[minmax(0,11fr)_minmax(0,12fr)] md:gap-20 lg:gap-24">
        {/* Left: Luxury arched editorial frame */}
        <Reveal x={-36} y={0} duration={1.25} className="relative mx-auto w-full max-w-[440px]">
          <motion.div style={{ y: imgY }} className="relative">
            {/* Double fine gold architectural arch behind image */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-3.5 rounded-t-[999px] rounded-b-[28px] border border-gold/55"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-6 rounded-t-[999px] rounded-b-[34px] border border-gold/20"
            />

            {/* Main arched portrait container */}
            <div className="relative overflow-hidden rounded-t-[999px] rounded-b-[22px] bg-espresso shadow-[0_38px_80px_-32px_rgba(48,30,14,0.65)] ring-1 ring-gold/40">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={story.image.src}
                  alt={story.image.alt}
                  fill
                  sizes="(min-width: 768px) 440px, 90vw"
                  quality={90}
                  className="object-cover object-center transition-transform duration-[1.8s] ease-out hover:scale-[1.04]"
                />
                {/* Editorial warm film vignette */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-espresso/35 via-transparent to-amber-200/5"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-3 rounded-t-[999px] rounded-b-[16px] border border-white/25"
                />
              </div>
            </div>
          </motion.div>
        </Reveal>

        {/* Right: Editorial story column */}
        <div className="relative text-center md:text-left">
          <Reveal delay={0.1}>
            <p className="eyebrow text-gold-deep">Capitolul nostru</p>
            <h2 id="poveste-title" className="mt-4 font-script text-6xl text-gold-deep sm:text-7xl">
              {story.title}
            </h2>
            <Ornament className="mx-auto mt-4 md:mx-0" />
          </Reveal>

          <Reveal delay={0.25}>
            <blockquote className="relative mt-8 md:border-l md:border-gold/60 md:pl-6">
              <span
                aria-hidden="true"
                className="pointer-events-none hidden select-none font-serif text-7xl leading-none text-gold/25 md:absolute md:-top-5 md:left-3 md:block"
              >
                „
              </span>
              <p className="relative font-serif text-2xl italic leading-snug text-ink sm:text-[1.8rem]">
                {story.subtitle}
              </p>
            </blockquote>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="mx-auto mt-7 max-w-xl space-y-5 font-serif text-lg leading-[1.85] text-muted sm:text-[1.22rem] md:mx-0">
              <p>{story.intro}</p>
              {story.full.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.55}>
            <p className="mt-8 font-script text-4xl text-gold-deep sm:text-[2.6rem]">
              {wedding.couple.names}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
