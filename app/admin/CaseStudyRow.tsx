"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Study = {
  id: string;
  title: string;
  client: string;
  year: number;
  outcomeKey: string;
  outcomeUnit: string;
  order: number;
  published: boolean;
  slug: string;
};

export function CaseStudyRow({ study }: { study: Study }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function togglePublish() {
    setBusy(true);
    await fetch(`/api/admin/case-studies/${study.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ published: !study.published }),
    });
    router.refresh();
    setBusy(false);
  }

  async function onDelete() {
    if (!confirm(`Delete "${study.title}"? This cannot be undone.`)) return;
    setBusy(true);
    await fetch(`/api/admin/case-studies/${study.id}`, { method: "DELETE" });
    router.refresh();
    setBusy(false);
  }

  return (
    <li className="grid grid-cols-12 gap-4 items-center border-b border-rule px-4 py-4 hover:bg-ink-raised">
      <span className="col-span-1 font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
        {String(study.order).padStart(2, "0")}
      </span>
      <span className="col-span-5 font-display text-base text-paper leading-tight">
        {study.title}
      </span>
      <span className="col-span-2 font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
        {study.client}
      </span>
      <span className="col-span-1 font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
        {study.year}
      </span>
      <span className="col-span-1 font-mono text-[10px] tracking-[0.22em] uppercase text-accent">
        {study.outcomeKey}
      </span>
      <span className="col-span-1">
        <button
          type="button"
          onClick={togglePublish}
          disabled={busy}
          className={`font-mono text-[10px] tracking-[0.22em] uppercase transition-colors ${
            study.published
              ? "text-accent hover:text-paper"
              : "text-paper-muted hover:text-paper"
          }`}
        >
          {study.published ? "● live" : "○ draft"}
        </button>
      </span>
      <span className="col-span-1 text-right flex items-center justify-end gap-3">
        <Link
          href={`/admin/case-studies/${study.id}/edit`}
          className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper hover:text-accent"
        >
          edit
        </Link>
        <button
          type="button"
          onClick={onDelete}
          disabled={busy}
          className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted hover:text-accent"
          title="Delete"
        >
          ✕
        </button>
      </span>
    </li>
  );
}
