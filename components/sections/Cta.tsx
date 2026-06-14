import { siteConfig } from "@/lib/site.config";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { HudClock } from "@/components/ui/HudClock";

export function Cta() {
  return (
    <section className="relative bg-ink">
      <div className="px-8 pt-24">
        <SectionHeader index="04" code="CONTACT" status="Inbox · open">
          One question we&rsquo;ll always ask first
        </SectionHeader>
      </div>

      <div className="relative px-8 pt-32 pb-40">
        {/* Schematic crosshair backdrop */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-full w-px bg-rule" />
          <div className="absolute left-0 top-1/2 h-px w-full bg-rule" />
        </div>

        <div className="relative max-w-5xl">
          <RevealOnScroll>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted mb-8">
              // The first conversation
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.05}>
            <h2 className="font-display text-[clamp(3rem,10vw,10rem)] leading-[0.88] tracking-[-0.035em] text-paper">
              Tell us where it{" "}
              <span className="italic">
                hurts<span className="not-italic text-accent">.</span>
              </span>
            </h2>
          </RevealOnScroll>

          <RevealOnScroll delay={0.15}>
            <p className="mt-10 max-w-xl font-display text-lg prose-body leading-relaxed">
              Twenty minutes, free, no deck. You describe what&rsquo;s slow,
              what&rsquo;s broken, what&rsquo;s held together with tape. We
              tell you whether software is the right answer — and if so, what
              the smallest first build looks like.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.22}>
            <div className="mt-14 flex flex-wrap items-center gap-8">
              <MagneticButton href={siteConfig.cta.primary.href}>
                {siteConfig.cta.primary.label}
              </MagneticButton>
              <HudClock />
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
