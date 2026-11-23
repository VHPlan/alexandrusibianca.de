"use client";

import { ArrowUp } from "lucide-react";
import { wedding } from "@/config/wedding";
import { Monogram } from "./ui/Monogram";
import { Ornament } from "./ui/Ornament";

export function Footer() {
  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    document.querySelector<HTMLAnchorElement>("header a")?.focus({ preventScroll: true });
  };

  return (
    <footer className="dark-satin relative overflow-hidden border-t border-gold/15 px-5 pb-12 pt-20 text-center sm:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/60 to-transparent"
      />
      <div className="mx-auto flex max-w-3xl flex-col items-center">
        <Monogram size="lg" />
        <p className="mt-7 font-script text-5xl text-white sm:text-6xl">
          <span>Alex</span>
          <span className="mx-2.5 inline-block align-middle text-[0.72em] text-gold-metal sm:mx-3">&amp;</span>
          <span>Bianca</span>
        </p>
        <p className="mt-3 font-serif text-xl tracking-[0.4em] text-ivory/85">{wedding.date.short}</p>
        <Ornament className="mt-6" tone="light" />
        <p className="mt-6 font-serif text-xl italic text-ivory/70 sm:text-2xl">{wedding.footer.message}</p>

        <button
          type="button"
          onClick={toTop}
          className="group mt-12 flex flex-col items-center gap-2 text-gold-light/80 transition hover:text-gold-light"
          aria-label="Înapoi sus"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 transition duration-500 group-hover:-translate-y-1 group-hover:border-gold group-hover:bg-gold/10">
            <ArrowUp size={18} strokeWidth={1.4} />
          </span>
          <span className="eyebrow !text-[0.58rem]">Înapoi sus</span>
        </button>

        <p className="mt-12 font-sans text-[0.7rem] tracking-[0.15em] text-ivory/35">
          © 2027 Alex &amp; Bianca · alexandrusibianca.de
        </p>
      </div>
    </footer>
  );
}
