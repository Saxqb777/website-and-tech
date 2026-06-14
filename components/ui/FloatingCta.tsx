"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { siteConfig } from "@/lib/site.config";

/**
 * Persistent CTA pill that appears after the user scrolls past the
 * hero. Hidden on /contact (already there) and on /admin (internal).
 * Desktop: fixed bottom-right. Mobile: full-width bar at the bottom.
 */
export function FloatingCta() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    setVisible(v > 480);
  });

  // Don't show on the contact page itself or anywhere in admin
  const hidden =
    pathname?.startsWith("/contact") || pathname?.startsWith("/admin");

  if (hidden) return null;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="fcta"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed z-40 inset-x-3 bottom-3 sm:inset-x-auto sm:right-6 sm:bottom-6 pointer-events-none"
        >
          <Link
            href={siteConfig.cta.primary.href}
            data-cursor="hover"
            className="group pointer-events-auto flex items-center justify-between gap-4 rounded-full bg-accent text-ink px-5 py-3.5 sm:px-6 sm:py-4 shadow-[0_14px_40px_-12px_rgba(60,224,255,0.55)] ring-1 ring-accent/40 hover:shadow-[0_18px_50px_-12px_rgba(60,224,255,0.75)] transition-shadow"
          >
            <span className="flex flex-col leading-tight">
              <span className="font-mono text-[9px] tracking-[0.22em] uppercase opacity-70">
                Talk to us
              </span>
              <span className="font-mono text-[11px] tracking-[0.22em] uppercase font-semibold">
                {siteConfig.cta.primary.label}
              </span>
            </span>
            <span
              aria-hidden
              className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-ink text-accent group-hover:translate-x-0.5 transition-transform"
            >
              ↗
            </span>
          </Link>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
