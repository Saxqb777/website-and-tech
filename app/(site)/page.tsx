import { siteConfig } from "@/lib/site.config";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Hero } from "@/components/sections/Hero";

/**
 * Phase 2 home: WebGL hero on top, placeholder story chapters below.
 * Real story sections land in Phase 3.
 */
export default function Home() {
  return (
    <>
      <Hero />

      {/* CHAPTER 1 — what we do (placeholder block to feel the scroll) */}
      <section className="relative px-8 py-40 border-t border-rule">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-3">
            <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-paper-muted">
              01 / What we do
            </p>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.03em] text-paper">
              Most businesses don&rsquo;t need <em>another website</em>. They
              need the <span className="text-accent">invisible workflow</span>{" "}
              underneath to stop costing them money.
            </h2>
            <p className="mt-10 max-w-xl font-display text-lg text-paper-muted leading-relaxed">
              We find the bottleneck — the spreadsheet held together with tape,
              the form that bounces between five inboxes — and we build the
              software that removes it. Sometimes that&rsquo;s a website.
              Usually it&rsquo;s the thing behind the website.
            </p>
          </div>
        </div>
      </section>

      {/* CHAPTER 2 — proof placeholder */}
      <section className="relative px-8 py-40 border-t border-rule">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-3">
            <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-paper-muted">
              02 / Proof
            </p>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.03em] text-paper">
              Built once. Pays for itself{" "}
              <span className="italic">
                forever<span className="not-italic text-accent">.</span>
              </span>
            </h2>
            <p className="mt-10 max-w-xl font-display text-lg text-paper-muted leading-relaxed">
              Real case studies arrive in Phase 3, served from the database and
              editable from the admin in Phase 4.
            </p>
          </div>
        </div>
      </section>

      {/* CHAPTER 3 — approach placeholder */}
      <section className="relative px-8 py-40 border-t border-rule">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-3">
            <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-paper-muted">
              03 / Approach
            </p>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.03em] text-paper">
              We understand <em>workflows</em>, not pages.
            </h2>
            <p className="mt-10 max-w-xl font-display text-lg text-paper-muted leading-relaxed">
              Short engagement. Ship fast. Prove the value before we discuss
              the next thing.
            </p>
          </div>
        </div>
      </section>

      {/* CTA — full-bleed */}
      <section className="relative px-8 py-40 border-t border-rule">
        <div className="max-w-5xl">
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-paper-muted mb-8">
            // Start
          </p>
          <h2 className="font-display text-[clamp(3rem,9vw,8rem)] leading-[0.9] tracking-[-0.035em] text-paper">
            Tell us where it{" "}
            <span className="italic">
              hurts<span className="not-italic text-accent">.</span>
            </span>
          </h2>
          <div className="mt-12">
            <MagneticButton href={siteConfig.cta.primary.href}>
              {siteConfig.cta.primary.label}
            </MagneticButton>
          </div>
        </div>
      </section>
    </>
  );
}
