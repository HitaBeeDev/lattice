import { cn } from "./cn";

const VARIANT_STYLES = {
  high: "bg-rose-100 text-rose-700 ring-rose-200",
  medium: "bg-amber-100 text-amber-700 ring-amber-200",
  low: "bg-emerald-100 text-emerald-700 ring-emerald-200",
} as const;

type BadgeProps = {
  children: string;
  className?: string;
  variant: keyof typeof VARIANT_STYLES;
};

export default function Badge({ children, className, variant }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ring-inset",
        VARIANT_STYLES[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
