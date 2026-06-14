import type { ReactNode } from "react";

type Props = {
  /** Two-digit section index, e.g. "01" */
  index: string;
  /** Mono code label */
  code: string;
  /** Right-hand status (string or rich node) */
  status?: ReactNode;
  children?: ReactNode;
};

/**
 * The schematic bar that opens every major section.
 * On phones: index + code stacked on one line, status hidden.
 * On wider screens: full three-column schematic bar.
 */
export function SectionHeader({ index, code, status, children }: Props) {
  return (
    <div className="border-y border-dashed border-rule py-3">
      {/* Mobile: tight one-line bar */}
      <div className="flex items-center justify-between gap-3 sm:hidden font-mono text-[10px] tracking-[0.22em] uppercase">
        <span className="text-paper-muted shrink-0">{index}</span>
        <span className="text-paper truncate">{code}</span>
        <span className="text-paper-muted shrink-0">
          {status ?? (
            <span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle mr-1.5" />
              Live
            </span>
          )}
        </span>
      </div>

      {/* sm+ : full schematic bar with subtitle slot */}
      <div className="hidden sm:grid grid-cols-12 gap-4">
        <div className="col-span-1 font-mono text-[10px] tracking-[0.22em] uppercase text-paper">
          {index}
        </div>
        <div className="col-span-7 font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
          <span className="text-paper-muted">/</span>{" "}
          <span className="text-paper">{code}</span>
          {children ? (
            <>
              <span className="text-paper-muted"> · </span>
              <span className="text-paper-muted">{children}</span>
            </>
          ) : null}
        </div>
        <div className="col-span-4 text-right font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
          {status ?? (
            <span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle mr-2" />
              Live
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
