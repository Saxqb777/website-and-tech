/**
 * Static fallback used when WebGL is unavailable, the user prefers
 * reduced motion, or we're on a small screen. Pure CSS gradients —
 * no animation, no scripts, no GPU.
 */
export function HeroFallback() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden bg-ink"
      style={{
        backgroundImage: [
          // a far-off "vein" of accent leaking from the top-right
          "radial-gradient(60% 50% at 75% 25%, rgba(60, 224, 255, 0.10) 0%, rgba(60, 224, 255, 0) 60%)",
          // a softer pool low-left
          "radial-gradient(70% 60% at 20% 80%, rgba(60, 224, 255, 0.05) 0%, rgba(60, 224, 255, 0) 70%)",
          // base ink wash
          "linear-gradient(180deg, #0A0B0D 0%, #0A0B0D 100%)",
        ].join(", "),
      }}
    >
      {/* thin grain-like overlay using SVG noise so it doesn't look flat */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.05] mix-blend-overlay"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="hero-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-noise)" />
      </svg>
    </div>
  );
}
