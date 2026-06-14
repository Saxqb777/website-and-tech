"use client";

import { useEffect, useState } from "react";

/**
 * Live UTC clock + uptime indicator. Renders a fixed timestamp during
 * SSR (matches initial markup) and switches to a ticking clock on mount.
 */
export function HudClock() {
  const [t, setT] = useState<string | null>(null);

  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      return (
        `${d.getUTCFullYear()}.${pad(d.getUTCMonth() + 1)}.${pad(d.getUTCDate())} ` +
        `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`
      );
    };
    setT(fmt());
    const id = setInterval(() => setT(fmt()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted tabular-nums">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle mr-2 animate-pulse" />
      {t ?? "0000.00.00 00:00:00 UTC"}
    </span>
  );
}
