import { siteConfig } from "@/lib/site.config";

export default function Home() {
  return (
    <main className="relative flex-1 flex flex-col px-8 py-10">
      {/* Top label row — confirms mono font + accent color are wired */}
      <header className="flex items-center justify-between text-[11px] tracking-[0.22em] uppercase font-mono text-paper-muted">
        <span className="text-paper">
          {siteConfig.brand}
          <span className="text-accent">.</span>
        </span>
        <span>Phase 0 — Scaffold</span>
      </header>

      {/* Centered display test — confirms variable serif + paper color */}
      <section className="flex-1 flex flex-col items-start justify-center max-w-5xl">
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-paper-muted mb-6">
          // hello
        </p>
        <h1 className="font-display text-[clamp(3.5rem,10vw,9rem)] leading-[0.92] tracking-[-0.035em] text-paper">
          {siteConfig.tagline.split(" ").map((word, i, arr) => (
            <span key={i}>
              {i === arr.length - 1 ? (
                <span className="italic">
                  {word.replace(".", "")}
                  <span className="text-accent not-italic">.</span>
                </span>
              ) : (
                <>{word} </>
              )}
            </span>
          ))}
        </h1>
        <p className="mt-10 max-w-xl font-display text-lg text-paper-muted leading-relaxed">
          {siteConfig.description}
        </p>
      </section>

      {/* Bottom label row — confirms config-driven nav */}
      <footer className="flex items-center justify-between text-[11px] tracking-[0.22em] uppercase font-mono text-paper-muted">
        <span>Mercury cyan · Fraunces · JetBrains Mono</span>
        <nav className="flex gap-6">
          {siteConfig.nav.map((item) => (
            <span key={item.href}>{item.label}</span>
          ))}
        </nav>
      </footer>
    </main>
  );
}
