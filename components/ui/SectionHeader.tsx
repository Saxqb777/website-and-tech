import type { ReactNode } from "react";

type Props = {
  /** Two-digit section index, e.g. "01" */
  index: string;
  /** Mono code label */
  code: string;
  /** Right-hand status string (mono) */
  status?: string;
  children?: ReactNode;
};

/**
 * The schematic bar that opens every major section.
 * Reads like a status line in a build console.
 */
export function SectionHeader({ index, code, status, children }: Props) {
  return (
    <div className="grid grid-cols-12 gap-4 border-y border-dashed border-rule py-3">
      <div className="col-span-2 md:col-span-1 font-mono text-[10px] tracking-[0.22em] uppercase text-paper">
        {index}
      </div>
      <div className="col-span-7 md:col-span-7 font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
        <span className="text-paper-muted">/</span>{" "}
        <span className="text-paper">{code}</span>
        {children ? (
          <>
            <span className="text-paper-muted"> · </span>
            <span className="text-paper-muted">{children}</span>
          </>
        ) : null}
      </div>
      <div className="col-span-3 md:col-span-4 text-right font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
        {status ?? (
          <span>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle mr-2" />
            Live
          </span>
        )}
      </div>
    </div>
  );
}
