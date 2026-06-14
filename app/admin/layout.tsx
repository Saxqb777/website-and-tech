import type { ReactNode } from "react";
import { siteConfig } from "@/lib/site.config";

export const metadata = {
  title: "Admin",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <header className="border-b border-rule px-8 py-5 flex items-center justify-between">
        <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
          <span className="text-paper">
            {siteConfig.brand}
            <span className="text-accent">.</span>
          </span>{" "}
          / admin
        </div>
        <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle mr-2" />
          internal · v1
        </div>
      </header>
      {children}
    </div>
  );
}
