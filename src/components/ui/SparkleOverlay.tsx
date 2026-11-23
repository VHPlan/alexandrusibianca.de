"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  phase: number;
  speed: number;
  kind: "dot" | "star";
  color: string;
};

const COLORS = [
  "245, 224, 168", // champagne light
  "216, 180, 108", // warm gold
  "255, 244, 214", // pearl glint
  "198, 162, 106", // antique gold
];

/** Subtle, luxury floating gold dust & twinkling star glints across the whole site. */
export function SparkleOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let particles: Particle[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = w < 640 ? 28 : 54;
      particles = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: i % 4 === 0 ? 1.8 + Math.random() * 2.2 : 0.9 + Math.random() * 1.4,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -0.12 - Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2,
        speed: 0.012 + Math.random() * 0.022,
        kind: i % 4 === 0 ? "star" : "dot",
        color: COLORS[i % COLORS.length],
      }));
    };

    const drawStar = (x: number, y: number, r: number, alpha: number, rgb: string) => {
      const len = r * 3.1;
      ctx.save();
      ctx.translate(x, y);
      // soft halo
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, len);
      grad.addColorStop(0, `rgba(${rgb}, ${alpha * 0.95})`);
      grad.addColorStop(0.4, `rgba(${rgb}, ${alpha * 0.28})`);
      grad.addColorStop(1, `rgba(${rgb}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, len, 0, Math.PI * 2);
      ctx.fill();

      // fine 4-point glint
      ctx.fillStyle = `rgba(255, 250, 236, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(0, -len);
      ctx.quadraticCurveTo(0, 0, len, 0);
      ctx.quadraticCurveTo(0, 0, 0, len);
      ctx.quadraticCurveTo(0, 0, -len, 0);
      ctx.quadraticCurveTo(0, 0, 0, -len);
      ctx.fill();
      ctx.restore();
    };

    const frame = () => {
      if (document.hidden) {
        raf = requestAnimationFrame(frame);
        return;
      }
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.speed;

        if (p.y < -20) {
          p.y = h + 20;
          p.x = Math.random() * w;
        }
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;

        // smooth twinkle curve
        const wave = 0.5 + 0.5 * Math.sin(p.phase);
        const alpha = p.kind === "star" ? Math.pow(wave, 2.4) * 0.85 : 0.14 + wave * 0.55;

        if (alpha < 0.03) continue;

        if (p.kind === "star") {
          drawStar(p.x, p.y, p.r, alpha, p.color);
        } else {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.6);
          grad.addColorStop(0, `rgba(${p.color}, ${alpha})`);
          grad.addColorStop(1, `rgba(${p.color}, 0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[85]"
    />
  );
}
