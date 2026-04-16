import { cn } from "./cn";

type BadgeProps = {
  children: string;
  className?: string;
  variant: "high" | "medium" | "low";
};

const variantClasses = {
  high: "bg-[#fde8e8] text-[#c0392b]",
  medium: "bg-[#fef3e2] text-[#b96a00]",
  low: "bg-[#e6f7f8] text-[#1a7a85]",
};

export default function Badge({ children, className, variant }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
