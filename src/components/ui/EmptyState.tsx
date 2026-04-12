import type { ReactNode } from "react";
import { cn } from "./cn";

type EmptyStateProps = {
  action?: ReactNode;
  className?: string;
  description: string;
  title: string;
};

export default function EmptyState({
  action,
  className,
  description,
  title,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-[1.75rem] border border-dashed border-black/10 bg-white/45 px-6 py-10 text-center backdrop-blur-sm",
        className
      )}
    >
      <div className="mx-auto max-w-md space-y-2">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="text-sm leading-6 text-slate-600">{description}</p>
        {action && <div className="pt-3">{action}</div>}
      </div>
    </div>
  );
}
