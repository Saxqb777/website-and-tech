// Single source of truth for brand text, nav, accent + headline copy.
// Change BRAND here and it propagates everywhere.

export const BRAND = "OBLIQUE" as const;

export const siteConfig = {
  brand: BRAND,
  tagline: "The machinery underneath.",
  description:
    "A software studio for the operational guts of a business. Find the bottleneck. Build the machinery. Ship it in ten days.",
  url: "https://oblique.studio",

  // 90% near-black + paper, 10% one electric accent. Used as a scalpel.
  colors: {
    ink: "#0A0B0D",       // near-black, primary background
    inkRaised: "#101216", // one notch above ink for surfaces
    paper: "#EDE9E1",     // warm off-white
    paperMuted: "#9A968D",
    accent: "#3CE0FF",    // Mercury cyan — the live wire
    rule: "#1C1F24",      // hairline rule color on ink
  },

  nav: [
    { label: "Work", href: "/work" },
    { label: "Approach", href: "/approach" },
    { label: "Contact", href: "/contact" },
  ],

  cta: {
    primary: { label: "Start a conversation", href: "/contact" },
  },
} as const;

export type SiteConfig = typeof siteConfig;
