import Link from "next/link";
import { siteConfig } from "@/lib/site.config";

type Props = {
  size?: "sm" | "lg";
  asLink?: boolean;
  className?: string;
};

/**
 * The brand wordmark with its signature trailing accent dot.
 * One source of truth for how the brand renders inline.
 */
export function Wordmark({ size = "sm", asLink = true, className }: Props) {
  const inner = (
    <span
      className={
        size === "lg"
          ? "font-mono text-[11px] tracking-[0.22em] uppercase"
          : "font-mono text-[11px] tracking-[0.22em] uppercase"
      }
    >
      {siteConfig.brand}
      <span className="text-accent">.</span>
    </span>
  );

  if (asLink) {
    return (
      <Link
        href="/"
        className={`text-paper hover:text-paper transition-colors ${className ?? ""}`}
        aria-label={`${siteConfig.brand} — home`}
        data-cursor="hover"
      >
        {inner}
      </Link>
    );
  }
  return <span className={`text-paper ${className ?? ""}`}>{inner}</span>;
}
