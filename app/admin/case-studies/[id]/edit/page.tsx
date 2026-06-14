import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { CaseStudyForm } from "../../CaseStudyForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditCaseStudyPage({ params }: Props) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { id } = await params;
  const s = await db.caseStudy.findUnique({ where: { id } });
  if (!s) notFound();

  return (
    <main className="px-8 py-10">
      <Link
        href="/admin"
        className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted hover:text-paper transition-colors"
      >
        ← back to console
      </Link>
      <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted mt-10 mb-3">
        // case-studies / edit · {s.slug}
      </p>
      <h1 className="font-display text-4xl leading-[1.05] tracking-[-0.02em] text-paper">
        {s.title}
      </h1>
      <CaseStudyForm
        mode="edit"
        initial={{
          id: s.id,
          slug: s.slug,
          title: s.title,
          client: s.client,
          year: s.year,
          summary: s.summary,
          outcomeKey: s.outcomeKey,
          outcomeUnit: s.outcomeUnit,
          tags: s.tags,
          order: s.order,
          published: s.published,
        }}
      />
    </main>
  );
}
