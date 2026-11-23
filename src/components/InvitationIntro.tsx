"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Sparkles } from "lucide-react";
import { wedding } from "@/config/wedding";
import { Ornament } from "./ui/Ornament";

const easeOut = [0.22, 1, 0.36, 1] as const;
const portalEase = [0.42, 0, 0.18, 1] as const;

// 28 deterministic radial sparkle burst particles
const BURST = Array.from({ length: 28 }, (_, i) => {
  const angle = (i / 28) * Math.PI * 2 + (i % 3) * 0.14;
  const dist = 110 + (i % 5) * 58;
  return {
    id: i,
    x: Math.round(Math.cos(angle) * dist),
    y: Math.round(Math.sin(angle) * dist),
    size: i % 3 === 0 ? 10 : 5,
    star: i % 3 === 0,
    delay: (i % 4) * 0.03,
  };
});

/**
 * Full-screen luxury wedding invitation intro cover.
 * On "Deschide invitația", triggers a golden stardust burst and opens a glowing
 * circular golden portal from the center of the screen straight into the ballroom Hero,
 * starting the background music immediately inside the user gesture.
 */
export function InvitationIntro() {
  const [phase, setPhase] = useState<"closed" | "opening" | "done">("closed");
  const reduce = useReducedMotion();

  useEffect(() => {
    if (phase === "done") {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  const handleEnter = () => {
    if (phase !== "closed") return;
    window.dispatchEvent(new CustomEvent("wedding:start-music"));
    setPhase("opening");
    window.setTimeout(() => setPhase("done"), reduce ? 350 : 2550);
  };

  if (phase === "done") return null;

  const opening = phase === "opening";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Invitație de nuntă — Alex & Bianca"
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden px-6 py-8"
    >
      {/* Hidden SVG mask — used on a 1:1 square (160vmax) so the portal is always a perfect circle */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute h-0 w-0"
        width="0"
        height="0"
      >
        <defs>
          <mask id="intro-portal-mask" maskContentUnits="objectBoundingBox">
            <rect x="0" y="0" width="1" height="1" fill="white" />
            <motion.circle
              cx="0.5"
              cy="0.5"
              fill="black"
              initial={{ r: 0 }}
              animate={opening ? { r: reduce ? 0 : 0.55 } : { r: 0 }}
              transition={{ duration: 2.2, delay: 0.25, ease: portalEase }}
            />
          </mask>
        </defs>
      </svg>

      {/* Masked 1:1 square backdrop — opens in a true circle synced with the gold ring */}
      <motion.div
        aria-hidden="true"
        animate={opening && reduce ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={
          reduce
            ? undefined
            : {
                mask: "url(#intro-portal-mask)",
                WebkitMask: "url(#intro-portal-mask)",
              }
        }
        className="pointer-events-none absolute left-1/2 top-1/2 h-[160vmax] w-[160vmax] -translate-x-1/2 -translate-y-1/2 bg-espresso"
      >
        <div className="fixed inset-0 left-1/2 top-1/2 h-[100dvh] w-[100vw] -translate-x-1/2 -translate-y-1/2">
          <Image
            src={wedding.hero.background}
            alt=""
            fill
            preload
            quality={85}
            sizes="100vw"
            className="scale-105 object-cover object-center opacity-50 blur-[4px]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(26,18,13,0.45)_0%,rgba(14,9,6,0.93)_100%)]" />
          {/* Outer fine gold architectural frame */}
          <div className="absolute inset-3.5 rounded-[22px] border border-gold/25 sm:inset-8 sm:rounded-[26px] md:inset-10" />
          <div className="absolute inset-5 rounded-[18px] border border-gold/12 sm:inset-10 sm:rounded-[20px] md:inset-12" />
        </div>
      </motion.div>

      {/* Expanding luminous double gold portal ring — synced pixel-for-pixel with the circle cutout */}
      {!reduce && opening && (
        <>
          <motion.div
            aria-hidden="true"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.1, opacity: [0, 0.95, 0.85, 0] }}
            transition={{ duration: 2.2, delay: 0.25, ease: portalEase }}
            className="pointer-events-none absolute h-[160vmax] w-[160vmax] rounded-full border-[2.5px] border-gold-light shadow-[0_0_70px_14px_rgba(228,204,156,0.6),inset_0_0_50px_6px_rgba(228,204,156,0.35)]"
          />
          <motion.div
            aria-hidden="true"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.04, opacity: [0, 0.65, 0] }}
            transition={{ duration: 2.25, delay: 0.3, ease: portalEase }}
            className="pointer-events-none absolute h-[160vmax] w-[160vmax] rounded-full border border-gold/55"
          />
          {/* Radial golden stardust burst */}
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2">
            {BURST.map((p) => (
              <motion.span
                key={p.id}
                initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                animate={{
                  x: p.x,
                  y: p.y,
                  scale: [0, 1.25, 0],
                  opacity: [0, 0.95, 0],
                }}
                transition={{ duration: 1.55, delay: p.delay, ease: easeOut }}
                style={{ width: p.size, height: p.size }}
                className={
                  p.star
                    ? "absolute -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[2px] bg-gold-light shadow-[0_0_12px_3px_rgba(245,224,168,0.9)]"
                    : "absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-champagne shadow-[0_0_8px_2px_rgba(228,204,156,0.85)]"
                }
              />
            ))}
          </div>
        </>
      )}

      {/* Center invitation lockup */}
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
        animate={
          opening
            ? reduce
              ? { opacity: 0 }
              : { opacity: 0, scale: 1.08, y: -12, filter: "blur(8px)" }
            : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
        }
        transition={{ duration: opening ? 0.85 : 0.9, ease: easeOut }}
        className="relative z-10 flex w-full max-w-xl flex-col items-center text-center"
      >
        {/* Royal A&B crest */}
        <div className="relative h-24 w-[144px] sm:h-36 sm:w-[216px]">
          <Image
            src="/images/wedding/logo-ab.png"
            alt="Alex & Bianca — A&B"
            fill
            preload
            sizes="216px"
            className="object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.75)]"
          />
        </div>

        {/* Eyebrow */}
        <div className="mt-5 flex items-center gap-2.5 sm:mt-6 sm:gap-4">
          <span
            aria-hidden="true"
            className="h-px w-6 bg-gradient-to-r from-transparent to-gold-light/80 sm:w-16"
          />
          <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-gold-light/90 sm:h-1.5 sm:w-1.5" />
          <p className="whitespace-nowrap font-serif text-[0.7rem] font-medium uppercase tracking-[0.34em] text-gold-light sm:text-sm sm:tracking-[0.45em]">
            Invitație de nuntă
          </p>
          <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-gold-light/90 sm:h-1.5 sm:w-1.5" />
          <span
            aria-hidden="true"
            className="h-px w-6 bg-gradient-to-l from-transparent to-gold-light/80 sm:w-16"
          />
        </div>

        {/* Couple names — stays on one balanced centered line on mobile & desktop */}
        <h1 className="mt-4 whitespace-nowrap font-script text-[2.95rem] leading-[1.2] text-white drop-shadow-[0_6px_28px_rgba(0,0,0,0.65)] min-[380px]:text-[3.35rem] sm:mt-5 sm:text-7xl md:text-8xl">
          <span>Alex</span>
          <span className="mx-2.5 inline-block align-middle text-[0.72em] text-gold-metal sm:mx-4">
            &amp;
          </span>
          <span>Bianca</span>
        </h1>

        <Ornament className="mt-3 sm:mt-4" tone="light" />

        {/* Date */}
        <p className="mt-4 whitespace-nowrap font-serif text-sm uppercase tracking-[0.28em] text-ivory/90 sm:mt-5 sm:text-lg sm:tracking-[0.4em]">
          15 · Octombrie · 2027
        </p>

        {/* Warm welcome line */}
        <p className="mt-3.5 max-w-[19rem] font-serif text-[0.98rem] italic leading-relaxed text-ivory/75 sm:mt-4 sm:max-w-md sm:text-lg">
          Cu bucurie în suflet, vă invităm să ne fiți alături în cea mai frumoasă zi din viața noastră.
        </p>

        {/* Enter invitation button */}
        <div className="mt-8 sm:mt-9">
          <button
            type="button"
            onClick={handleEnter}
            disabled={opening}
            className="group relative inline-flex cursor-pointer items-center justify-center rounded-full p-[4px] ring-1 ring-gold/55 transition duration-500 hover:scale-[1.03] hover:ring-gold sm:p-[5px]"
          >
            <span className="btn-gold !px-8 !py-3.5 !text-[0.72rem] sm:!px-11 sm:!py-4 sm:!text-[0.8rem]">
              <Sparkles size={14} strokeWidth={1.6} aria-hidden="true" />
              <span>Deschide invitația</span>
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
