import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CornerBrackets } from "@/components/ui/CornerBrackets";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { siteConfig } from "@/lib/site.config";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const s = await db.caseStudy.findUnique({ where: { slug } });
  if (!s) return { title: "Not found" };
  return {
    title: s.title,
    description: s.summary,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const s = await db.caseStudy.findUnique({ where: { slug } });
  if (!s || !s.published) notFound();

  const tags = s.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <article className="relative bg-ink">
      <div className="px-8 pt-40">
        <SectionHeader
          index={`CS · ${s.year}`}
          code={s.client.toUpperCase().replace(/\s+/g, ".")}
          status={s.outcomeKey + " · " + s.outcomeUnit}
        >
          Case study · pulled from the studio database
        </SectionHeader>
      </div>

      <div className="px-8 pt-16 pb-24">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-9">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted mb-6">
              // {s.client} · {s.year}
            </p>
            <h1 className="font-display text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.03em] text-paper">
              {s.title}
            </h1>
            <p className="mt-10 max-w-2xl font-display text-xl prose-body leading-relaxed">
              {s.summary}
            </p>
          </div>
          <div className="col-span-12 md:col-span-3">
            <div className="relative border border-rule px-6 py-8">
              <CornerBrackets />
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
                Outcome
              </p>
              <div className="mt-6 font-display text-6xl leading-none text-accent">
                {s.outcomeKey}
              </div>
              <div className="mt-3 font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
                {s.outcomeUnit}
              </div>
              <div className="mt-8 border-t border-dashed border-rule pt-4 flex flex-wrap gap-2">
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
          </div>
        </div>

        <div className="mt-32 grid grid-cols-12 gap-8 border-t border-dashed border-rule pt-16">
          <div className="col-span-12 md:col-span-4">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
              ← back
            </p>
            <Link
              href="/work"
              data-cursor="hover"
              className="mt-3 inline-block font-display text-2xl text-paper hover:text-accent transition-colors"
            >
              All builds
            </Link>
          </div>
          <div className="col-span-12 md:col-span-8">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted mb-6">
              // got a similar bottleneck?
            </p>
            <MagneticButton href={siteConfig.cta.primary.href}>
              {siteConfig.cta.primary.label}
            </MagneticButton>
          </div>
        </div>
      </div>
    </article>
  );
}
