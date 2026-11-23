"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const TARGET_VOLUME = 0.35;

/** Subtle, luxury floating music control for background wedding audio. */
export function BackgroundMusic({ src = "/audio/lele.mp3" }: { src?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const fadeRef = useRef<number | null>(null);

  const fadeIn = (audio: HTMLAudioElement) => {
    if (fadeRef.current) window.clearInterval(fadeRef.current);
    audio.volume = 0;
    let vol = 0;
    fadeRef.current = window.setInterval(() => {
      vol = Math.min(TARGET_VOLUME, vol + 0.035);
      audio.volume = vol;
      if (vol >= TARGET_VOLUME && fadeRef.current) {
        window.clearInterval(fadeRef.current);
        fadeRef.current = null;
      }
    }, 80);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = true;
    audio.volume = TARGET_VOLUME;

    // Triggered synchronously when clicking "Deschide invitația" on the intro cover
    const onStartEvent = () => {
      audio.volume = 0;
      const playPromise = audio.play();
      if (playPromise) {
        playPromise
          .then(() => {
            fadeIn(audio);
            setPlaying(true);
          })
          .catch(() => {
            setPlaying(false);
          });
      }
    };

    window.addEventListener("wedding:start-music", onStartEvent);

    return () => {
      window.removeEventListener("wedding:start-music", onStartEvent);
      if (fadeRef.current) window.clearInterval(fadeRef.current);
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      if (fadeRef.current) {
        window.clearInterval(fadeRef.current);
        fadeRef.current = null;
      }
      audio.pause();
      setPlaying(false);
    } else {
      try {
        await audio.play();
        fadeIn(audio);
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
  };

  return (
    <>
      <audio ref={audioRef} src={src} preload="auto" loop aria-hidden="true" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Oprește muzica de fundal" : "Pornește muzica de fundal"}
        aria-pressed={playing}
        className="group fixed bottom-4 right-4 z-50 flex h-11 w-11 items-center justify-center gap-2.5 rounded-full border border-gold/45 bg-espresso/85 text-gold-light shadow-[0_14px_35px_-12px_rgba(0,0,0,0.85)] backdrop-blur-md transition-all duration-300 hover:border-gold hover:bg-espresso sm:bottom-7 sm:right-7 sm:h-auto sm:w-auto sm:px-4 sm:py-2.5"
      >
        <span className="flex h-5 w-5 items-center justify-center">
          {playing ? (
            <Volume2 size={17} strokeWidth={1.6} aria-hidden="true" />
          ) : (
            <VolumeX size={17} strokeWidth={1.6} aria-hidden="true" className="opacity-80" />
          )}
        </span>
        <span className="hidden font-sans text-[0.65rem] font-medium uppercase tracking-[0.22em] sm:inline">
          {playing ? "Muzică" : "Pornește muzica"}
        </span>
        {playing && (
          <span aria-hidden="true" className="hidden h-3.5 items-end gap-[2px] sm:flex">
            <span className="h-full w-[2px] animate-pulse rounded-full bg-gold-light" />
            <span className="h-2/3 w-[2px] animate-pulse rounded-full bg-gold [animation-delay:180ms]" />
            <span className="h-4/5 w-[2px] animate-pulse rounded-full bg-gold-light [animation-delay:340ms]" />
          </span>
        )}
      </button>
    </>
  );
}
