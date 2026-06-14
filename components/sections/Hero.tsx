"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site.config";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { KineticHeadline } from "@/components/motion/KineticHeadline";
import { HeroFallback } from "@/components/three/HeroFallback";

// Lazy-load the canvas so three.js stays out of the initial bundle.
// SSR off because R3F needs window.
const HeroCanvas = dynamic(
  () => import("@/components/three/HeroCanvas").then((m) => m.HeroCanvas),
  { ssr: false, loading: () => <HeroFallback /> },
);

function detectWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(
      c.getContext("webgl2") ||
      c.getContext("webgl") ||
      c.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

export function Hero() {
  const [renderShader, setRenderShader] = useState(false);

  useEffect(() => {
    // Shader runs on every device that can handle WebGL and isn't
    // explicitly asking for reduced motion. Mobile DPR is capped
    // inside HeroCanvas so performance stays sane on phones.
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setRenderShader(!reduce && detectWebGL());
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0">
        {renderShader ? <HeroCanvas /> : <HeroFallback />}
      </div>

      {/* Bottom fade — pulls the lower 55% of the hero down into solid
          ink so headline body copy + CTAs sit on a readable ground. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55vh] bg-gradient-to-b from-transparent via-ink/70 to-ink"
      />

      {/* Content layer */}
      <div className="relative z-10 flex min-h-screen flex-col px-5 sm:px-8 pt-28 sm:pt-40 pb-10 sm:pb-12">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-mono text-[11px] tracking-[0.22em] uppercase text-paper-muted"
        >
          // {new Date().getFullYear()} — A studio, not an agency
        </motion.p>

        <div className="mt-auto max-w-6xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-mono text-[11px] tracking-[0.22em] uppercase text-paper-muted mb-8"
          >
            // The machinery underneath
          </motion.p>

          <KineticHeadline
            words={[
              { text: "We" },
              { text: "build" },
              { text: "the" },
              { text: "things" },
              { text: "no" },
              { text: "one" },
              { text: "sees", italic: true, accentDot: true },
            ]}
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.05 }}
            className="mt-8 sm:mt-12 max-w-xl font-display text-lg sm:text-xl prose-body leading-relaxed"
          >
            {siteConfig.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2 }}
            className="mt-8 sm:mt-12 flex flex-wrap gap-3"
          >
            <MagneticButton href={siteConfig.cta.primary.href}>
              {siteConfig.cta.primary.label}
            </MagneticButton>
            <MagneticButton href="/work" variant="ghost">
              See the work
            </MagneticButton>
          </motion.div>
        </div>

        {/* Bottom HUD: scroll affordance + phase label */}
        <div className="mt-12 sm:mt-16 flex items-end justify-between gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="flex items-center gap-3"
          >
            <span
              aria-hidden
              className="block h-px w-10 bg-paper-muted"
              style={{ transformOrigin: "left center" }}
            />
            <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-paper-muted">
              Scroll
            </p>
            <motion.span
              aria-hidden
              animate={{ y: [0, 6, 0] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block text-paper-muted"
            >
              ↓
            </motion.span>
          </motion.div>
          <p className="hidden sm:block font-mono text-[11px] tracking-[0.22em] uppercase text-paper-muted text-right">
            4 sections · one page · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </section>
  );
}
