"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Mask-reveal kinetic headline. Each "word" is a clip-mask;
 * children slide up from below it with a stagger on mount.
 */
type Word = { text: string; italic?: boolean; accentDot?: boolean };

const baseTransition = {
  duration: 0.95,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

export function KineticHeadline({ words }: { words: Word[] }) {
  return (
    <h1 className="font-display text-[clamp(2.5rem,11.5vw,12rem)] leading-[0.88] tracking-[-0.035em] text-paper">
      <span className="flex flex-wrap gap-x-[0.22em] gap-y-[0.05em]">
        {words.map((w, i) => (
          <WordMask key={i} delay={0.15 + i * 0.09}>
            {w.italic ? <span className="italic">{w.text}</span> : w.text}
            {w.accentDot ? (
              <span className="not-italic text-accent">.</span>
            ) : null}
          </WordMask>
        ))}
      </span>
    </h1>
  );
}

function WordMask({
  children,
  delay,
}: {
  children: ReactNode;
  delay: number;
}) {
  return (
    <span className="relative inline-block overflow-hidden align-bottom pb-[0.05em]">
      <motion.span
        className="inline-block will-change-transform"
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ ...baseTransition, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
