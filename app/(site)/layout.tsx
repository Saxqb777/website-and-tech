import type { ReactNode } from "react";
import { Nav } from "@/components/ui/Nav";
import { Footer } from "@/components/ui/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Cursor } from "@/components/ui/Cursor";
import { RouteTransition } from "@/components/motion/RouteTransition";
import { FloatingCta } from "@/components/ui/FloatingCta";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Keyboard-only skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[150] focus:bg-paper focus:text-ink focus:px-4 focus:py-2 focus:font-mono focus:text-[11px] focus:tracking-[0.22em] focus:uppercase"
      >
        Skip to content
      </a>

      <SmoothScroll />
      <Cursor />
      <Nav />
      <main id="main" className="relative">
        <RouteTransition>{children}</RouteTransition>
      </main>
      <Footer />
      <FloatingCta />
    </>
  );
}
