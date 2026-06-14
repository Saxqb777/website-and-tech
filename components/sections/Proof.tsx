import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CornerBrackets } from "@/components/ui/CornerBrackets";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Magnetic } from "@/components/motion/Magnetic";
import { listPublishedCaseStudies } from "@/lib/case-studies";

/**
 * DB-backed proof section. Renders the 2-3 most recent published
 * case studies as asymmetric bold cards.
 */
export async function Proof() {
  const studies = await listPublishedCaseStudies(3);

  return (
    <section className="relative bg-ink">
      <div className="px-8 pt-24">
        <SectionHeader index="02" code="PROOF" status="DB · live">
          Case studies · pulled from the studio database
        </SectionHeader>
      </div>

      <div className="px-8 py-24">
        <div className="grid grid-cols-12 gap-6">
          {studies.map((s, i) => {
            const tags = s.tags.split(",").map((t) => t.trim()).filter(Boolean);
            // Asymmetric layout — first card large, second offset narrow,
            // third (if present) full-width below.
            const col =
              i === 0
                ? "col-span-12 md:col-span-8"
                : i === 1
                  ? "col-span-12 md:col-span-4"
                  : "col-span-12";
            return (
              <RevealOnScroll
                key={s.id}
                delay={i * 0.08}
                className={`${col} group`}
              >
                <Link
                  href={`/work/${s.slug}`}
                  data-cursor="hover"
                  className="relative block border border-rule hover:border-paper transition-colors duration-500"
                >
                  <CornerBrackets />
                  <div className="p-8 md:p-10">
                    <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
                      <span>
                        CS_{String(i + 1).padStart(2, "0")} / {s.year}
                      </span>
                      <span>{s.client}</span>
                    </div>

                    <h3 className="mt-8 font-display text-[clamp(1.6rem,2.8vw,2.6rem)] leading-[1.05] tracking-[-0.02em] text-paper">
                      {s.title}
                    </h3>

                    <p className="mt-6 max-w-xl font-display text-base prose-body leading-relaxed">
                      {s.summary}
                    </p>

                    <div className="mt-10 flex items-end justify-between gap-8 border-t border-dashed border-rule pt-6">
                      <div>
                        <div className="font-display text-4xl text-accent leading-none">
                          {s.outcomeKey}
                        </div>
                        <div className="mt-2 font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
                          {s.outcomeUnit}
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-end gap-2 max-w-[60%]">
                        {tags.map((t) => (
                          <span
                            key={t}
                            className="font-mono text-[10px] tracking-[0.18em] uppercase text-paper-muted border border-rule px-2 py-1"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
                      <span>Read the build</span>
                      <span className="text-paper transition-transform duration-500 group-hover:translate-x-1">
                        ↗
                      </span>
                    </div>
                  </div>
                </Link>
              </RevealOnScroll>
            );
          })}
        </div>

        <RevealOnScroll
          delay={0.2}
          className="mt-16 flex items-center justify-between border-t border-dashed border-rule pt-6"
        >
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
            {studies.length} of {studies.length} records · sorted by build order
          </p>
          <Magnetic strength={0.25}>
            <Link
              href="/work"
              data-cursor="hover"
              className="font-mono text-[11px] tracking-[0.22em] uppercase text-paper hover:text-accent transition-colors"
            >
              See every build ↗
            </Link>
          </Magnetic>
        </RevealOnScroll>
      </div>
    </section>
  );
}
