import { cn } from "./cn";

type ProgressBarProps = {
  className?: string;
  label?: string;
  value: number;
};

export default function ProgressBar({ className, label, value }: ProgressBarProps) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>{label}</span>
          <span>{safeValue}%</span>
        </div>
      )}
      <progress
        aria-label={label ?? "Progress"}
        className="h-2.5 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-slate-200 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-slate-900"
        max={100}
        value={safeValue}
      />
    </div>
  );
}
