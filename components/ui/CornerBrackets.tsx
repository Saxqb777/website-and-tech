/**
 * Four small L-shapes at the corners of an element — a schematic
 * crop-mark frame. Use to "select" a region the way a CAD tool would.
 */
type Props = { className?: string };

export function CornerBrackets({ className }: Props) {
  const arm = "absolute h-3 w-3 border-paper/40";
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className ?? ""}`}
    >
      <span className={`${arm} left-0  top-0    border-l border-t`} />
      <span className={`${arm} right-0 top-0    border-r border-t`} />
      <span className={`${arm} left-0  bottom-0 border-l border-b`} />
      <span className={`${arm} right-0 bottom-0 border-r border-b`} />
    </span>
  );
}
