import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CornerBrackets } from "@/components/ui/CornerBrackets";
import { listPublishedCaseStudies } from "@/lib/case-studies";

export const metadata = {
  title: "Work",
  description:
    "Every build, with the metric that mattered. Pulled live from the studio database.",
};

// Render on demand — case studies are DB-backed.
export const dynamic = "force-dynamic";

export default async function WorkPage() {
  const studies = await listPublishedCaseStudies();

  return (
    <section className="relative min-h-screen bg-ink">
      <div className="px-8 pt-40">
        <SectionHeader
          index="00"
          code="WORK.INDEX"
          status={`${studies.length} record${studies.length === 1 ? "" : "s"}`}
        >
          Every build, sorted by deployment order
        </SectionHeader>
      </div>

      <div className="px-8 pt-16 pb-24">
        <h1 className="font-display text-[clamp(3rem,9vw,8rem)] leading-[0.9] tracking-[-0.035em] text-paper max-w-5xl">
          The machinery, in{" "}
          <span className="italic">
            evidence<span className="not-italic text-accent">.</span>
          </span>
        </h1>

        <ul className="mt-24 divide-y divide-rule border-y border-rule">
          {studies.map((s, i) => {
            const tags = s.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);
            return (
              <li key={s.id} className="group relative">
                <Link
                  href={`/work/${s.slug}`}
                  data-cursor="hover"
                  className="grid grid-cols-12 gap-6 items-baseline py-10 transition-colors hover:bg-ink-raised px-2 -mx-2"
                >
                  <div className="col-span-2 md:col-span-1 font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="col-span-10 md:col-span-7">
                    <h2 className="font-display text-2xl md:text-4xl leading-[1.05] tracking-[-0.02em] text-paper">
                      {s.title}
                    </h2>
                    <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
                      <span>{s.client}</span>
                      <span>· {s.year}</span>
                      {tags.slice(0, 3).map((t) => (
                        <span key={t}>· {t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-9 md:col-span-3 self-center">
                    <div className="font-display text-3xl md:text-4xl text-accent leading-none">
                      {s.outcomeKey}
                    </div>
                    <div className="mt-2 font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
                      {s.outcomeUnit}
                    </div>
                  </div>
                  <div className="col-span-3 md:col-span-1 self-center text-right font-mono text-base text-paper transition-transform duration-500 group-hover:translate-x-1">
                    ↗
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        {studies.length === 0 ? (
          <div className="mt-12 relative border border-rule px-8 py-16">
            <CornerBrackets />
            <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-paper-muted">
              No published case studies yet. Add some from{" "}
              <Link href="/admin" className="text-paper hover:text-accent">
                /admin
              </Link>
              .
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
