import type { ReactNode } from "react";
import { cn } from "./cn";

type TooltipProps = {
  children: ReactNode;
  content: ReactNode;
};

export default function Tooltip({ children, content }: TooltipProps) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 rounded-lg bg-slate-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition",
          "group-hover:opacity-100 group-focus-within:opacity-100"
        )}
      >
        {content}
      </span>
    </span>
  );
}
