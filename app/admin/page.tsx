import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { LogoutButton } from "./LogoutButton";
import { CaseStudyRow } from "./CaseStudyRow";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  if (!(await isAdmin())) redirect("/admin/login");

  const [studies, leads] = await Promise.all([
    db.caseStudy.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    }),
    db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
  ]);

  return (
    <main className="px-8 py-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
            // console
          </p>
          <h1 className="mt-2 font-display text-5xl leading-[1.05] tracking-[-0.02em] text-paper">
            Studio operations
            <span className="text-accent">.</span>
          </h1>
        </div>
        <LogoutButton />
      </div>

      {/* CASE STUDIES */}
      <section className="mt-16">
        <div className="flex items-end justify-between border-b border-rule pb-4">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
              01 / case-studies
            </p>
            <h2 className="mt-2 font-display text-2xl text-paper">
              {studies.length} record{studies.length === 1 ? "" : "s"}
            </h2>
          </div>
          <Link
            href="/admin/case-studies/new"
            className="inline-flex items-center gap-3 rounded-full bg-paper px-5 py-3 font-mono text-[10px] tracking-[0.22em] uppercase text-ink hover:bg-accent transition-colors"
          >
            + New case study
          </Link>
        </div>

        <div className="mt-6 border border-rule">
          <div className="grid grid-cols-12 gap-4 border-b border-rule px-4 py-3 font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
            <span className="col-span-1">#</span>
            <span className="col-span-5">Title</span>
            <span className="col-span-2">Client</span>
            <span className="col-span-1">Year</span>
            <span className="col-span-1">Outcome</span>
            <span className="col-span-1">Status</span>
            <span className="col-span-1 text-right">Edit</span>
          </div>
          {studies.length === 0 ? (
            <div className="px-4 py-10 font-mono text-[11px] tracking-[0.22em] uppercase text-paper-muted">
              No case studies yet — create one.
            </div>
          ) : (
            <ul>
              {studies.map((s) => (
                <CaseStudyRow key={s.id} study={s} />
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* LEADS */}
      <section className="mt-24 pb-24">
        <div className="flex items-end justify-between border-b border-rule pb-4">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
              02 / leads
            </p>
            <h2 className="mt-2 font-display text-2xl text-paper">
              {leads.length} record{leads.length === 1 ? "" : "s"}{" "}
              {leads.length === 50 ? "(most recent)" : ""}
            </h2>
          </div>
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
            inbox · open
          </span>
        </div>

        {leads.length === 0 ? (
          <div className="mt-6 border border-rule px-4 py-10 font-mono text-[11px] tracking-[0.22em] uppercase text-paper-muted">
            No leads yet — try submitting the contact form to test.
          </div>
        ) : (
          <ul className="mt-6 divide-y divide-rule border border-rule">
            {leads.map((l) => (
              <li key={l.id} className="px-4 py-5">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-3">
                    <p className="font-display text-lg text-paper">{l.name}</p>
                    <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted mt-1">
                      {l.email}
                      {l.company ? ` · ${l.company}` : ""}
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-7">
                    <p className="font-display text-base text-paper leading-relaxed">
                      {l.message}
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-2 text-right">
                    <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted tabular-nums">
                      {new Date(l.createdAt).toISOString().replace("T", " ").slice(0, 19)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
