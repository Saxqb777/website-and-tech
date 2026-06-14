import Link from "next/link";
import { Magnetic } from "@/components/motion/Magnetic";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
};

/**
 * The studio's CTA button. Pill, mono label, magnetic hover.
 * One primitive for every "do something" moment on the site.
 */
export function MagneticButton({ href, children, variant = "primary" }: Props) {
  const base =
    "inline-flex items-center gap-3 rounded-full px-7 py-4 font-mono text-[11px] tracking-[0.22em] uppercase transition-colors";
  const styles =
    variant === "primary"
      ? `${base} bg-paper text-ink hover:bg-accent`
      : `${base} border border-rule text-paper hover:border-paper`;

  return (
    <Magnetic strength={0.3} className="inline-block">
      <Link href={href} data-cursor="hover" className={styles}>
        <span>{children}</span>
        <span aria-hidden className="text-base leading-none">
          ↗
        </span>
      </Link>
    </Magnetic>
  );
}
