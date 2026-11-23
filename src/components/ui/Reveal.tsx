"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

type RevealProps = HTMLMotionProps<"div"> & {
  as?: "div" | "li" | "article";
  delay?: number;
  y?: number;
  x?: number;
  duration?: number;
  amount?: number;
};

const TAGS = { div: motion.div, li: motion.li, article: motion.article } as const;

/** Soft fade + upward drift when scrolled into view. Respects prefers-reduced-motion. */
export function Reveal({
  as = "div",
  children,
  delay = 0,
  y = 28,
  x = 0,
  duration = 1.1,
  amount = 0.25,
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = TAGS[as] as typeof motion.div;
  return (
    <Comp
      initial={reduce ? { opacity: 0 } : { opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: reduce ? 0.3 : duration, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
