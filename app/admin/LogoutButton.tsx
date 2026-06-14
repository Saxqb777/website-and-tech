"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function onClick() {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted hover:text-paper transition-colors"
    >
      {busy ? "…" : "Log out ↗"}
    </button>
  );
}
