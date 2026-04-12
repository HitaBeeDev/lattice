/* eslint-disable react/prop-types */
import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "./cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <div className="space-y-1.5">
      <input
        ref={ref}
        aria-invalid={Boolean(error)}
        className={cn(
          "w-full rounded-xl border bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-offset-1",
          error
            ? "border-rose-400 focus:border-rose-400 focus:ring-rose-200"
            : "border-slate-200 focus:border-slate-400 focus:ring-slate-200",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-rose-600">{error}</p>}
    </div>
  )
);

Input.displayName = "Input";

export default Input;
