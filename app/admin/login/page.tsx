import { redirect } from "next/navigation";
import { isAdmin, isPasswordConfigured } from "@/lib/auth";
import { LoginForm } from "./LoginForm";
import { SetupForm } from "./SetupForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");
  const configured = await isPasswordConfigured();

  return (
    <main className="px-8 py-24">
      <div className="max-w-md">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted mb-4">
          // {configured ? "restricted" : "first-time setup"}
        </p>
        <h1 className="font-display text-5xl leading-[1.05] tracking-[-0.02em] text-paper">
          {configured ? "Identify yourself" : "Set the admin password"}
          <span className="text-accent">.</span>
        </h1>
        {configured ? (
          <LoginForm />
        ) : (
          <>
            <p className="mt-6 max-w-md font-display text-base prose-body leading-relaxed">
              No password configured yet. Choose one now — it&rsquo;s hashed
              with bcrypt and stored in your local database. You&rsquo;ll be
              logged in straight away.
            </p>
            <SetupForm />
          </>
        )}
      </div>
    </main>
  );
}
