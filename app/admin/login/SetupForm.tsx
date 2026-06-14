"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SetupForm() {
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (pw.length < 10) {
      setError("Password must be at least 10 characters.");
      return;
    }
    if (pw !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: pw, confirm }),
      });
      const body = (await res.json()) as { ok: boolean; error?: string };
      if (!body.ok) {
        setError(body.error ?? "Setup failed");
        setBusy(false);
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Network error");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 space-y-6">
      <FieldRow
        index="01"
        label="New password"
        id="pw"
        type="password"
        autoComplete="new-password"
        value={pw}
        onChange={setPw}
        disabled={busy}
        hint="At least 10 characters."
      />
      <FieldRow
        index="02"
        label="Confirm password"
        id="confirm"
        type="password"
        autoComplete="new-password"
        value={confirm}
        onChange={setConfirm}
        disabled={busy}
        hint="Type it again."
      />
      {error ? (
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-accent">
          ✗ {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center gap-3 rounded-full bg-paper px-7 py-4 font-mono text-[11px] tracking-[0.22em] uppercase text-ink hover:bg-accent transition-colors disabled:opacity-50"
      >
        {busy ? "Setting…" : "Set password & enter"}
        <span aria-hidden>↗</span>
      </button>
      <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
        This screen disappears once a password is set. If you forget it, drop
        the row from the `Setting` table (`prisma studio`) and the form will
        come back.
      </p>
    </form>
  );
}

function FieldRow({
  index,
  label,
  id,
  type,
  value,
  onChange,
  disabled,
  hint,
  autoComplete,
}: {
  index: string;
  label: string;
  id: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  hint?: string;
  autoComplete?: string;
}) {
  return (
    <div className="border-b border-rule pb-1">
      <div className="flex items-baseline gap-3 pt-1">
        <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
          {index}
        </span>
        <label
          htmlFor={id}
          className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper"
        >
          {label}
        </label>
      </div>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={hint}
        className="w-full bg-transparent font-display text-2xl text-paper placeholder:text-paper-muted/60 placeholder:font-display focus:outline-none py-2"
      />
    </div>
  );
}
