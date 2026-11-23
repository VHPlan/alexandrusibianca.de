"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { wedding } from "@/config/wedding";
import { SectionHeading } from "./ui/SectionHeading";
import { Reveal } from "./ui/Reveal";

const items = wedding.gallery;

export function Gallery() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    el?.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el?.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const onTrackKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByCard(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByCard(-1);
    }
  };

  return (
    <section
      id="galerie"
      aria-labelledby="galerie-title"
      className="satin-ivory relative overflow-hidden py-24 md:py-32"
    >
      <div className="px-5 sm:px-8">
        <SectionHeading
          id="galerie-title"
          eyebrow="Momente"
          title="Galerie"
          script
          subtitle="Detalii care ne inspiră pentru ziua cea mare."
        />
      </div>

      <Reveal delay={0.15} className="relative mt-14 md:mt-16">
        <ul
          ref={trackRef}
          tabIndex={0}
          onKeyDown={onTrackKey}
          aria-label="Galerie foto — folosiți săgețile pentru a derula"
          className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-5 pb-6 pt-2 sm:px-8 lg:px-[max(3rem,calc((100vw-72rem)/2))]"
        >
          {items.map((img, i) => (
            <li
              key={img.src}
              className="relative w-[78vw] shrink-0 snap-center sm:w-[46vw] lg:w-[min(30rem,34vw)]"
            >
              <button
                type="button"
                onClick={() => setLightbox(i)}
                className="group relative block aspect-[4/5] w-full overflow-hidden rounded-[22px] border border-gold/25 bg-champagne shadow-[0_25px_50px_-28px_rgba(80,55,30,0.55)] sm:aspect-[4/3]"
                aria-label={`Mărește imaginea: ${img.alt}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 480px, (min-width: 640px) 46vw, 78vw"
                  className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05]"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
                />
                <span
                  aria-hidden="true"
                  className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white/85 text-gold-deep opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                >
                  <Expand size={16} strokeWidth={1.5} />
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            aria-label="Imaginea anterioară"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 text-gold-deep transition hover:bg-gold hover:text-white disabled:pointer-events-none disabled:opacity-35"
          >
            <ChevronLeft size={20} strokeWidth={1.4} />
          </button>
          <span className="h-px w-16 bg-gold/50" aria-hidden="true" />
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            aria-label="Imaginea următoare"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 text-gold-deep transition hover:bg-gold hover:text-white disabled:pointer-events-none disabled:opacity-35"
          >
            <ChevronRight size={20} strokeWidth={1.4} />
          </button>
        </div>
      </Reveal>

      <Lightbox index={lightbox} onClose={() => setLightbox(null)} onChange={setLightbox} />
    </section>
  );
}

function Lightbox({
  index,
  onClose,
  onChange,
}: {
  index: number | null;
  onClose: () => void;
  onChange: (i: number) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const open = index !== null;

  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return;
      onChange((index + dir + items.length) % items.length);
    },
    [index, onChange],
  );

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab" && dialogRef.current) {
        // simple focus trap
        const f = dialogRef.current.querySelectorAll<HTMLElement>("button");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prevFocus?.focus();
    };
  }, [open, onClose, go]);

  // touch swipe
  const touchX = useRef<number | null>(null);

  return (
    <AnimatePresence>
      {open && index !== null && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Vizualizare imagine"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0d0806]/95 p-4 backdrop-blur-sm sm:p-10"
          onClick={onClose}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full max-h-[82vh] w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={items[index].src}
              alt={items[index].alt}
              fill
              sizes="100vw"
              quality={90}
              className="rounded-xl object-contain"
            />
          </motion.div>
          <p className="absolute bottom-5 left-1/2 w-[90%] -translate-x-1/2 text-center font-serif text-base italic text-ivory/75 sm:bottom-8 sm:text-lg">
            {items[index].alt} · {index + 1} / {items.length}
          </p>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Închide galeria"
            className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-gold-light transition hover:bg-gold/15 sm:right-8 sm:top-8"
          >
            <X size={22} strokeWidth={1.4} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Imaginea anterioară"
            className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 bg-black/30 text-gold-light transition hover:bg-gold/15 sm:left-8"
          >
            <ChevronLeft size={24} strokeWidth={1.4} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Imaginea următoare"
            className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 bg-black/30 text-gold-light transition hover:bg-gold/15 sm:right-8"
          >
            <ChevronRight size={24} strokeWidth={1.4} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
