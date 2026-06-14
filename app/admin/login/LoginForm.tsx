"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [pw, setPw] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const body = (await res.json()) as { ok: boolean; error?: string };
      if (!body.ok) {
        setError(body.error ?? "Login failed");
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
      <div className="border-b border-rule pb-2">
        <label
          htmlFor="pw"
          className="block font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted mb-2"
        >
          Password
        </label>
        <input
          id="pw"
          type="password"
          autoComplete="current-password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          disabled={busy}
          className="w-full bg-transparent font-display text-2xl text-paper focus:outline-none py-2"
        />
      </div>
      {error ? (
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-accent">
          ✗ {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center gap-3 rounded-full bg-paper px-7 py-4 font-mono text-[11px] tracking-[0.22em] uppercase text-ink transition-colors hover:bg-accent disabled:opacity-50"
      >
        {busy ? "Checking…" : "Enter"}
        <span aria-hidden>↗</span>
      </button>
    </form>
  );
}
