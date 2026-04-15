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
        "rounded-[1.75rem] border border-white/70 bg-white/60 p-8 text-center shadow-[0_18px_55px_rgba(80,111,122,0.08)]",
        className,
      )}
    >
      <div className="mx-auto max-w-[34rem]">
        <h3 className="font-['Sora'] text-2xl text-[#101820]">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-[#5a707a]">{description}</p>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}
