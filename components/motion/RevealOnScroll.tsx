"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Delay in seconds before this element animates in. */
  delay?: number;
  /** y-offset to start from. */
  y?: number;
  className?: string;
  as?: "div" | "section" | "p" | "h2" | "h3" | "span" | "li";
};

/**
 * Slide-up + fade-in on scroll-into-view. Triggers once.
 * The default behavior of every block in the lower sections.
 */
export function RevealOnScroll({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
