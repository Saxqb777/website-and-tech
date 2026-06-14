import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";

const PILLARS = [
  {
    code: "P–01",
    title: "Workflows, not pages.",
    body: "Most studios sell pages. We sell the system that makes the pages unnecessary, or the one that makes them work. Either way, the website is downstream of the workflow.",
  },
  {
    code: "P–02",
    title: "Ten-day cycles, real software.",
    body: "Every ten days you get a working slice in the hands of real users — not a deck. Direction corrects against reality, not against the slide before it.",
  },
  {
    code: "P–03",
    title: "You keep the source.",
    body: "Code, infrastructure, accounts — yours from day one. We're a co-pilot you can fire. The point isn't to lock you in, it's to leave you machinery you own.",
  },
];

export function Approach() {
  return (
    <section className="relative bg-ink">
      <div className="px-8 pt-24">
        <SectionHeader index="03" code="APPROACH" status="Three pillars">
          How we build — and why it doesn&rsquo;t look like an agency
        </SectionHeader>
      </div>

      <div className="px-8 py-24">
        <RevealOnScroll>
          <h2 className="max-w-5xl font-display text-[clamp(2.5rem,6.5vw,6rem)] leading-[0.95] tracking-[-0.03em] text-paper">
            We&rsquo;re an engineering studio that{" "}
            <span className="italic">talks to the business,</span> not a
            marketing studio that{" "}
            <span className="italic">talks to the engineers</span>
            <span className="not-italic text-accent">.</span>
          </h2>
        </RevealOnScroll>

        <div className="mt-20 grid grid-cols-12 gap-6">
          {PILLARS.map((p, i) => (
            <RevealOnScroll
              key={p.code}
              delay={0.06 * i}
              className="col-span-12 md:col-span-4"
            >
              <div className="relative h-full border-t border-paper/40 pt-6">
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted mb-6">
                  {p.code}
                </p>
                <h3 className="font-display text-2xl md:text-3xl leading-[1.1] tracking-[-0.02em] text-paper">
                  {p.title}
                </h3>
                <p className="mt-5 font-display text-base prose-body leading-relaxed">
                  {p.body}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
