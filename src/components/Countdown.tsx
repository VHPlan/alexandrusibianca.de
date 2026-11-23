"use client";

import { useEffect, useState } from "react";
import { wedding } from "@/config/wedding";
import { Reveal } from "./ui/Reveal";
import { Ornament } from "./ui/Ornament";

type Parts = { days: number; hours: number; minutes: number; seconds: number; done: boolean };

const TARGET = new Date(wedding.date.iso).getTime();

export function getRemaining(now: number, target = TARGET): Parts {
  const diff = Math.max(0, target - now);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: diff === 0,
  };
}

export function Countdown() {
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    const tick = () => setParts(getRemaining(Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const units: { label: string; value: number | undefined }[] = [
    { label: "Zile", value: parts?.days },
    { label: "Ore", value: parts?.hours },
    { label: "Minute", value: parts?.minutes },
    { label: "Secunde", value: parts?.seconds },
  ];

  return (
    <section
      id="countdown"
      aria-labelledby="countdown-title"
      className="satin-ivory relative px-5 pb-20 pt-14 sm:pb-28 sm:pt-20"
    >
      <Reveal className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <h2 id="countdown-title" className="font-script text-5xl text-gold-deep sm:text-6xl md:text-7xl">
          Mai sunt până la nuntă
        </h2>
        <Ornament className="mt-4" />
      </Reveal>

      <Reveal delay={0.15} className="mx-auto mt-10 max-w-4xl sm:mt-14">
        {parts?.done ? (
          <p className="text-center font-serif text-3xl text-ink">Astăzi este marea zi!</p>
        ) : (
          <div
            role="timer"
            aria-live="off"
            aria-label={
              parts
                ? `${parts.days} zile, ${parts.hours} ore, ${parts.minutes} minute și ${parts.seconds} secunde până la nuntă`
                : "Numărătoare inversă până la nuntă"
            }
            className="grid grid-cols-4 items-start"
          >
            {units.map((u, i) => (
              <div key={u.label} className="relative flex flex-col items-center px-1">
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-[18%] h-[52%] w-px bg-gradient-to-b from-transparent via-gold/60 to-transparent"
                  />
                )}
                <span
                  suppressHydrationWarning
                  className="font-serif text-[2.6rem] font-light leading-none tabular-nums text-ink min-[400px]:text-5xl sm:text-7xl md:text-[5.5rem]"
                >
                  {u.value === undefined ? "--" : String(u.value).padStart(u.label === "Zile" ? 1 : 2, "0")}
                </span>
                <span className="eyebrow mt-3 !text-[0.6rem] !tracking-[0.3em] text-gold-deep sm:mt-4 sm:!text-[0.72rem]">
                  {u.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </Reveal>
    </section>
  );
}
