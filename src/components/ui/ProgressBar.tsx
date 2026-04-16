import { cn } from "./cn";
import { getPercentageFillClass } from "../../lib/progressStyles";

type ProgressBarProps = {
  className?: string;
  label?: string;
  value: number;
};

export default function ProgressBar({
  className,
  label,
  value,
}: ProgressBarProps) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("space-y-4", className)}>
      {label && (
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7d929c]">
            {label}
          </span>
          <span className="text-sm font-medium text-[#1b2830]">
            {safeValue}%
          </span>
        </div>
      )}
      <div className="space-y-3">
        <div className="h-3 overflow-hidden rounded-full bg-[#dbe8eb]">
          <div className={getPercentageFillClass(safeValue, "h-full rounded-full bg-[#72e1ee] transition-all")} />
        </div>
        <p className="text-sm leading-6 text-[#627882]">
          {safeValue >= 80
            ? "Excellent pace across the week."
            : safeValue >= 50
              ? "The routine is holding."
              : "Room to tighten the loop."}
        </p>
      </div>
    </div>
  );
}
