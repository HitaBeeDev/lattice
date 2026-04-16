import type { ReactElement, ReactNode } from "react";

type TooltipProps = {
  children: ReactElement;
  content: ReactNode;
};

export default function Tooltip({ children, content }: TooltipProps) {
  return (
    <div className="group relative inline-flex">
      {children}
      <div
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#161c22] px-2.5 py-1.5 text-xs text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {content}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#161c22]"
        />
      </div>
    </div>
  );
}
