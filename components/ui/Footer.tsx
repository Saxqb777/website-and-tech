import Link from "next/link";
import { siteConfig } from "@/lib/site.config";
import { Magnetic } from "@/components/motion/Magnetic";

/**
 * Footer shell. The brand wordmark is treated as a design moment —
 * full-bleed, oversized, with the accent dot doing the talking.
 * Polished further in Phase 5.
 */
export function Footer() {
  return (
    <footer className="relative border-t border-rule">
      <div className="px-8 pt-24 pb-8">
        <div className="flex flex-col gap-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-paper-muted mb-6">
              // {siteConfig.tagline}
            </p>
            <div className="flex flex-col gap-3 font-mono text-[11px] tracking-[0.22em] uppercase">
              {siteConfig.nav.map((item) => (
                <Magnetic key={item.href} strength={0.25}>
                  <Link
                    href={item.href}
                    data-cursor="hover"
                    className="text-paper/80 hover:text-paper transition-colors"
                  >
                    {item.label}
                  </Link>
                </Magnetic>
              ))}
            </div>
          </div>

          <div className="text-right">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
              {new Date().getFullYear()} —{" "}
              <Link
                href="/contact"
                className="hover:text-paper transition-colors"
                data-cursor="hover"
              >
                Start a conversation
              </Link>
            </p>
          </div>
        </div>

        {/* Oversized wordmark as a design moment. */}
        <h2
          aria-hidden
          className="font-display italic text-paper mt-24 leading-none tracking-[-0.04em] text-[clamp(5rem,22vw,22rem)] select-none"
        >
          {siteConfig.brand}
          <span className="not-italic text-accent">.</span>
        </h2>
      </div>
    </footer>
  );
}
