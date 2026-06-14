import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");
  const configured = !!process.env.ADMIN_PASSWORD_HASH;
  return (
    <main className="px-8 py-24">
      <div className="max-w-md">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted mb-4">
          // restricted
        </p>
        <h1 className="font-display text-5xl leading-[1.05] tracking-[-0.02em] text-paper">
          Identify yourself
          <span className="text-accent">.</span>
        </h1>
        {!configured ? (
          <div className="mt-10 border border-rule p-6">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-accent mb-3">
              ✗ Admin password not set
            </p>
            <p className="font-display text-base text-paper-muted leading-relaxed">
              Run{" "}
              <code className="bg-ink-raised px-2 py-0.5 text-paper text-sm font-mono">
                npm run admin:set-password
              </code>{" "}
              in your terminal to create one. The script writes a hash to{" "}
              <code className="font-mono">.env</code> — the plaintext password
              never leaves your machine.
            </p>
          </div>
        ) : (
          <LoginForm />
        )}
      </div>
    </main>
  );
}
