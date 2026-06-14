import { SectionHeader } from "@/components/ui/SectionHeader";
import { Process } from "@/components/sections/Process";
import { Approach as ApproachPillars } from "@/components/sections/Approach";
import { Cta } from "@/components/sections/Cta";

export const metadata = {
  title: "Approach",
  description:
    "How we work — four steps from first conversation to live software you own.",
};

export default function ApproachPage() {
  return (
    <article className="relative bg-ink">
      {/* Page header */}
      <div className="px-5 sm:px-8 pt-28 sm:pt-40">
        <SectionHeader index="00" code="APPROACH" status="Process · Pillars">
          How we build — and why it doesn&rsquo;t look like an agency
        </SectionHeader>
      </div>

      <div className="px-5 sm:px-8 pt-12 sm:pt-16 pb-16 sm:pb-24">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted mb-6">
          // how we work
        </p>
        <h1 className="font-display text-[clamp(2.25rem,7.5vw,7rem)] leading-[0.92] tracking-[-0.035em] text-paper max-w-5xl">
          Four steps. Three weeks to first ship. Yours from day{" "}
          <span className="italic">
            one<span className="not-italic text-accent">.</span>
          </span>
        </h1>
        <p className="mt-8 max-w-2xl font-display text-lg sm:text-xl prose-body leading-relaxed">
          We don&rsquo;t sell decks. We don&rsquo;t sell six-month roadmaps. We
          sell working software inside three weeks — and we leave you the
          source code so you can fire us the day you don&rsquo;t need us.
        </p>
      </div>

      {/* The Process — four expressive steps with a growing accent line */}
      <Process />

      {/* Pillars — the why underneath the how */}
      <ApproachPillars />

      {/* CTA */}
      <Cta />
    </article>
  );
}
