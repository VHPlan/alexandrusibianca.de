"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ChevronDown } from "lucide-react";
import { wedding } from "@/config/wedding";
import { RingsIcon } from "./ui/Ornament";
import { Curve } from "./ui/Curve";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "35%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const fade = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24, filter: "blur(6px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 1.4, delay, ease },
  });

  return (
    <section
      id="acasa"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-espresso"
    >
      {/* Background photograph with slow cinematic zoom + parallax */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-20">
        <div className="absolute inset-0 animate-hero-zoom">
          <Image
            src={wedding.hero.background}
            alt=""
            fill
            preload
            quality={90}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </motion.div>

      {/* Cinematic grading — keeps bright chandelier/drapery atmospheric while ensuring crisp text contrast */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_62%_56%_at_50%_48%,rgba(18,11,7,0.58)_0%,rgba(18,11,7,0.52)_55%,rgba(14,9,6,0.82)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-black/65 via-black/15 to-espresso/90"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex w-full flex-col items-center px-5 pb-20 pt-28 text-center sm:px-6 sm:pt-44 md:pt-48"
      >
        {/* Framed editorial eyebrow */}
        <motion.div {...fade(0.2)} className="flex items-center gap-2.5 sm:gap-5">
          <span
            aria-hidden="true"
            className="h-px w-7 bg-gradient-to-r from-transparent to-gold-light/80 sm:w-20"
          />
          <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-gold-light/90 sm:h-1.5 sm:w-1.5" />
          <p className="whitespace-nowrap font-serif text-xs font-medium uppercase tracking-[0.38em] [word-spacing:0.35em] text-gold-light drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] sm:text-lg sm:tracking-[0.5em] sm:[word-spacing:0.45em] md:text-xl">
            {wedding.hero.eyebrow}
          </p>
          <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-gold-light/90 sm:h-1.5 sm:w-1.5" />
          <span
            aria-hidden="true"
            className="h-px w-7 bg-gradient-to-l from-transparent to-gold-light/80 sm:w-20"
          />
        </motion.div>

        {/* Cursive calligraphic couple names — single balanced line on mobile & desktop */}
        <motion.h1
          id="hero-title"
          {...fade(0.45)}
          className="mt-6 whitespace-nowrap font-script text-[3.15rem] leading-[1.2] text-white drop-shadow-[0_6px_30px_rgba(0,0,0,0.65)] min-[380px]:text-[3.55rem] sm:mt-10 sm:text-[6.5rem] md:text-[8.5rem] lg:text-[9.5rem]"
        >
          <span>Alex</span>
          <span className="mx-2.5 inline-block align-middle text-[0.72em] text-gold-metal sm:mx-5">&amp;</span>
          <span>Bianca</span>
        </motion.h1>

        {/* Fine rings ornament */}
        <motion.div {...fade(0.7)} className="mt-5 flex items-center gap-3.5 text-gold-light/90 sm:mt-8 sm:gap-4">
          <span className="h-px w-14 bg-gradient-to-r from-transparent via-gold/70 to-gold sm:w-28" />
          <RingsIcon className="h-5 w-9 sm:h-6 sm:w-10" />
          <span className="h-px w-14 bg-gradient-to-l from-transparent via-gold/70 to-gold sm:w-28" />
        </motion.div>

        {/* Architectural engraved date lockup */}
        <motion.div
          {...fade(0.9)}
          aria-label="15 Octombrie 2027"
          className="mt-6 flex items-center gap-4 sm:mt-7 sm:gap-8"
        >
          <span className="font-serif text-xs uppercase tracking-[0.28em] text-ivory/85 sm:text-base sm:tracking-[0.38em] md:text-lg">
            Octombrie
          </span>
          <span
            aria-hidden="true"
            className="h-7 w-px bg-gradient-to-b from-transparent via-gold/75 to-transparent sm:h-10"
          />
          <span className="font-serif text-3xl font-light tracking-[0.08em] text-gold-metal sm:text-5xl md:text-6xl">
            15
          </span>
          <span
            aria-hidden="true"
            className="h-7 w-px bg-gradient-to-b from-transparent via-gold/75 to-transparent sm:h-10"
          />
          <span className="font-serif text-xs uppercase tracking-[0.28em] text-ivory/85 sm:text-base sm:tracking-[0.38em] md:text-lg">
            2027
          </span>
        </motion.div>

        {/* Jewel-framed CTA button */}
        <motion.div {...fade(1.1)} className="mt-9 sm:mt-10">
          <a
            href="#countdown"
            className="group relative inline-flex items-center justify-center rounded-full p-[4px] ring-1 ring-gold/45 transition duration-500 hover:ring-gold/85"
          >
            <span className="btn-gold !px-7 !py-3 !text-[0.72rem] sm:!px-8 sm:!py-3.5 sm:!text-[0.78rem]">
              {wedding.hero.cta}
            </span>
          </a>
        </motion.div>
      </motion.div>

      <motion.a
        href="#countdown"
        aria-label="Derulează în jos"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-14 left-1/2 z-20 -translate-x-1/2 text-gold-light/80 sm:bottom-20"
      >
        <motion.span
          className="block"
          animate={reduce ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={26} strokeWidth={1.2} />
        </motion.span>
      </motion.a>

      <Curve fill="var(--color-ivory)" />
    </section>
  );
}
