"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/lib/site.config";
import { HudClock } from "@/components/ui/HudClock";

type FieldKey = "name" | "email" | "company" | "message";
type Errors = Partial<Record<FieldKey, string>>;
type Form = Record<FieldKey, string>;

const FIELDS: Array<{
  key: FieldKey;
  index: string;
  label: string;
  hint: string;
  type?: "text" | "email";
  multiline?: boolean;
  optional?: boolean;
}> = [
  {
    key: "name",
    index: "01",
    label: "Your name",
    hint: "What we call you in the reply.",
  },
  {
    key: "email",
    index: "02",
    label: "Email",
    hint: "Where the conversation continues.",
    type: "email",
  },
  {
    key: "company",
    index: "03",
    label: "Company",
    hint: "Optional — useful but not required.",
    optional: true,
  },
  {
    key: "message",
    index: "04",
    label: "Where it hurts",
    hint: "Two sentences is plenty. The bottleneck, the cost, who feels it.",
    multiline: true,
  },
];

const initial: Form = { name: "", email: "", company: "", message: "" };

export function ContactForm() {
  const [form, setForm] = useState<Form>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "submitting" | "done">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setState("submitting");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = (await res.json()) as {
        ok: boolean;
        errors?: Errors;
      };
      if (!body.ok) {
        setErrors(body.errors ?? {});
        setState("idle");
        return;
      }
      setState("done");
    } catch {
      setErrors({ message: "Network error. Try again in a moment." });
      setState("idle");
    }
  }

  if (state === "done") return <SubmittedState />;

  return (
    <form onSubmit={onSubmit} className="relative">
      <div className="grid grid-cols-12 gap-6 sm:gap-8">
        {FIELDS.map((f) => (
          <div
            key={f.key}
            className="col-span-12 md:col-span-10 md:col-start-3"
          >
            <FieldRow
              field={f}
              value={form[f.key]}
              error={errors[f.key]}
              disabled={state === "submitting"}
              onChange={(v) => setForm((p) => ({ ...p, [f.key]: v }))}
            />
          </div>
        ))}

        <div className="col-span-12 md:col-span-10 md:col-start-3 flex flex-wrap items-center gap-8 border-t border-dashed border-rule pt-8">
          <button
            type="submit"
            data-cursor="hover"
            disabled={state === "submitting"}
            className="group inline-flex items-center gap-3 rounded-full bg-paper px-7 py-4 font-mono text-[11px] tracking-[0.22em] uppercase text-ink transition-colors hover:bg-accent disabled:opacity-50"
          >
            <span>
              {state === "submitting" ? "Sending…" : "Send it"}
            </span>
            <span aria-hidden className="text-base leading-none">
              ↗
            </span>
          </button>
          <HudClock />
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
            {siteConfig.brand} · intake · v1
          </p>
        </div>
      </div>
    </form>
  );
}

function FieldRow({
  field,
  value,
  error,
  disabled,
  onChange,
}: {
  field: (typeof FIELDS)[number];
  value: string;
  error?: string;
  disabled?: boolean;
  onChange: (v: string) => void;
}) {
  const id = `f-${field.key}`;
  return (
    <div className="grid grid-cols-12 gap-4 border-b border-rule pb-2">
      <div className="col-span-3 md:col-span-2 pt-4">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
          {field.index}
        </p>
        <label
          htmlFor={id}
          className="block mt-1 font-mono text-[10px] tracking-[0.22em] uppercase text-paper"
        >
          {field.label}
        </label>
        {field.optional ? (
          <p className="mt-1 font-mono text-[9px] tracking-[0.22em] uppercase text-paper-muted/70">
            optional
          </p>
        ) : null}
      </div>
      <div className="col-span-9 md:col-span-10">
        {field.multiline ? (
          <textarea
            id={id}
            disabled={disabled}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.hint}
            rows={4}
            className="w-full bg-transparent font-display text-xl sm:text-2xl md:text-3xl leading-[1.25] text-paper placeholder:text-paper-muted/60 placeholder:font-display focus:outline-none resize-none py-3"
          />
        ) : (
          <input
            id={id}
            type={field.type ?? "text"}
            disabled={disabled}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.hint}
            className="w-full bg-transparent font-display text-2xl sm:text-3xl md:text-4xl text-paper placeholder:text-paper-muted/60 placeholder:font-display focus:outline-none py-3"
          />
        )}
        {error ? (
          <p className="mt-1 font-mono text-[10px] tracking-[0.22em] uppercase text-accent">
            ✗ {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function SubmittedState() {
  return (
    <AnimatePresence>
      <motion.div
        key="done"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="border border-rule px-8 py-16 md:px-16 md:py-24"
      >
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
          // intake · received
        </p>
        <h2 className="mt-6 font-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.92] tracking-[-0.03em] text-paper">
          Got it.{" "}
          <span className="italic">
            We'll write back within one working day
            <span className="not-italic text-accent">.</span>
          </span>
        </h2>
        <p className="mt-10 max-w-xl font-display text-lg prose-body leading-relaxed">
          Reply lands from a real person. If your bottleneck doesn&rsquo;t fit
          our shop, we&rsquo;ll say so and point you somewhere better.
        </p>
        <div className="mt-10 flex items-center gap-6 border-t border-dashed border-rule pt-6">
          <HudClock />
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
            confirmation · saved
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
