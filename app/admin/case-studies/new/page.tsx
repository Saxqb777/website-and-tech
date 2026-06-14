import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { CaseStudyForm } from "../CaseStudyForm";

export const dynamic = "force-dynamic";

export default async function NewCaseStudyPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  return (
    <main className="px-8 py-10">
      <Link
        href="/admin"
        className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted hover:text-paper transition-colors"
      >
        ← back to console
      </Link>
      <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted mt-10 mb-3">
        // case-studies / new
      </p>
      <h1 className="font-display text-5xl leading-[1.05] tracking-[-0.02em] text-paper">
        New case study
        <span className="text-accent">.</span>
      </h1>
      <p className="mt-4 max-w-xl font-display text-base text-paper-muted leading-relaxed">
        These fields appear in /work, on the home page proof grid, and on the
        case study&rsquo;s own page at /work/[slug].
      </p>
      <CaseStudyForm mode="create" />
    </main>
  );
}
