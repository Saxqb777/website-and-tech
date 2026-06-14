"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "create" | "edit";

type Initial = {
  id?: string;
  slug: string;
  title: string;
  client: string;
  year: number;
  summary: string;
  outcomeKey: string;
  outcomeUnit: string;
  tags: string;
  order: number;
  published: boolean;
};

const EMPTY: Initial = {
  slug: "",
  title: "",
  client: "",
  year: new Date().getFullYear(),
  summary: "",
  outcomeKey: "",
  outcomeUnit: "",
  tags: "",
  order: 0,
  published: true,
};

export function CaseStudyForm({
  mode,
  initial,
}: {
  mode: Mode;
  initial?: Initial;
}) {
  const router = useRouter();
  const [form, setForm] = useState<Initial>(initial ?? EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  function set<K extends keyof Initial>(key: K, value: Initial[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setGeneralError(null);
    const url =
      mode === "create"
        ? "/api/admin/case-studies"
        : `/api/admin/case-studies/${initial?.id}`;
    const method = mode === "create" ? "POST" : "PATCH";
    try {
      const res = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = (await res.json()) as {
        ok: boolean;
        errors?: Record<string, string>;
        error?: string;
      };
      if (!body.ok) {
        setErrors(body.errors ?? {});
        setGeneralError(body.error ?? null);
        setBusy(false);
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setGeneralError("Network error");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 space-y-6">
      <Field
        label="Title"
        index="01"
        value={form.title}
        error={errors.title}
        onChange={(v) => set("title", v)}
        big
      />
      <Field
        label="Slug"
        index="02"
        value={form.slug}
        error={errors.slug}
        hint="url-safe-id"
        onChange={(v) => set("slug", v)}
      />
      <Field
        label="Client"
        index="03"
        value={form.client}
        error={errors.client}
        onChange={(v) => set("client", v)}
      />
      <Field
        label="Year"
        index="04"
        value={String(form.year)}
        error={errors.year}
        onChange={(v) => set("year", Number(v) || form.year)}
      />
      <Field
        label="Summary"
        index="05"
        value={form.summary}
        error={errors.summary}
        onChange={(v) => set("summary", v)}
        multiline
      />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6">
          <Field
            label="Outcome metric"
            index="06"
            value={form.outcomeKey}
            error={errors.outcomeKey}
            onChange={(v) => set("outcomeKey", v)}
            hint="e.g. 5x  ·  72h"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <Field
            label="Outcome unit"
            index="07"
            value={form.outcomeUnit}
            error={errors.outcomeUnit}
            onChange={(v) => set("outcomeUnit", v)}
            hint="e.g. saved per morning"
          />
        </div>
      </div>
      <Field
        label="Tags (comma separated)"
        index="08"
        value={form.tags}
        onChange={(v) => set("tags", v)}
        hint="ops, logistics, internal-tool"
      />
      <div className="grid grid-cols-12 gap-4 items-end">
        <div className="col-span-6">
          <Field
            label="Display order"
            index="09"
            value={String(form.order)}
            onChange={(v) => set("order", Number(v) || 0)}
            hint="lower = earlier"
          />
        </div>
        <div className="col-span-6 flex items-center gap-3 pb-2">
          <input
            id="pub"
            type="checkbox"
            checked={form.published}
            onChange={(e) => set("published", e.target.checked)}
            className="accent-accent h-4 w-4"
          />
          <label
            htmlFor="pub"
            className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper"
          >
            Published
          </label>
        </div>
      </div>

      {generalError ? (
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-accent">
          ✗ {generalError}
        </p>
      ) : null}

      <div className="pt-6 border-t border-dashed border-rule flex items-center gap-4">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-3 rounded-full bg-paper px-7 py-4 font-mono text-[11px] tracking-[0.22em] uppercase text-ink hover:bg-accent transition-colors disabled:opacity-50"
        >
          {busy
            ? mode === "create"
              ? "Creating…"
              : "Saving…"
            : mode === "create"
              ? "Create case study"
              : "Save changes"}
          <span aria-hidden>↗</span>
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted hover:text-paper transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  index,
  value,
  onChange,
  error,
  hint,
  multiline,
  big,
}: {
  label: string;
  index: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
  multiline?: boolean;
  big?: boolean;
}) {
  const baseInput =
    "w-full bg-transparent text-paper placeholder:text-paper-muted/60 focus:outline-none py-2 font-display";
  return (
    <div className="border-b border-rule">
      <div className="flex items-baseline gap-3 pt-3">
        <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
          {index}
        </span>
        <label className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper">
          {label}
        </label>
      </div>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={hint}
          className={`${baseInput} text-lg resize-none`}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={hint}
          className={`${baseInput} ${big ? "text-3xl md:text-4xl" : "text-xl"}`}
        />
      )}
      {error ? (
        <p className="pb-2 font-mono text-[10px] tracking-[0.22em] uppercase text-accent">
          ✗ {error}
        </p>
      ) : null}
    </div>
  );
}
