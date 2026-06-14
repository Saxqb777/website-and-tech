"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { siteConfig } from "@/lib/site.config";
import { Magnetic } from "@/components/motion/Magnetic";
import { Wordmark } from "@/components/ui/Wordmark";

export function Nav() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [condensed, setCondensed] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    setCondensed(v > 24);
  });

  return (
    <motion.header
      initial={false}
      animate={{
        paddingTop: condensed ? 14 : 28,
        paddingBottom: condensed ? 14 : 28,
        backgroundColor: condensed ? "rgba(10,11,13,0.72)" : "rgba(10,11,13,0)",
        backdropFilter: condensed ? "blur(12px)" : "blur(0px)",
      }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-5 sm:px-8"
    >
      <div className="flex items-center justify-between">
        <Magnetic strength={0.4}>
          <Wordmark />
        </Magnetic>

        <nav className="flex items-center gap-0 sm:gap-2">
          {siteConfig.nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Magnetic key={item.href} strength={0.3}>
                <Link
                  href={item.href}
                  data-cursor="hover"
                  className="group relative px-2 sm:px-3 py-2 font-mono text-[10px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.22em] uppercase text-paper/80 hover:text-paper transition-colors"
                >
                  <span className="relative">
                    {item.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-px bg-accent transition-all duration-300 ${
                        active ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </span>
                </Link>
              </Magnetic>
            );
          })}
        </nav>
      </div>
    </motion.header>
  );
}
