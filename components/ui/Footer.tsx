import Link from "next/link";
import { siteConfig } from "@/lib/site.config";
import { Magnetic } from "@/components/motion/Magnetic";

/**
 * Minimal footer: tagline + nav + year + small wordmark. The oversized
 * wordmark moment was removed at the user's request.
 */
export function Footer() {
  return (
    <footer className="relative border-t border-rule">
      <div className="px-8 pt-16 pb-10">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
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
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted mb-3">
              {new Date().getFullYear()} —{" "}
              <Link
                href="/contact"
                className="hover:text-paper transition-colors"
                data-cursor="hover"
              >
                Start a conversation
              </Link>
            </p>
            <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-paper">
              {siteConfig.brand}
              <span className="text-accent">.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
