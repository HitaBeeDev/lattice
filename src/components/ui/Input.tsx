/* eslint-disable react/prop-types */
import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "./cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <div className="space-y-2">
      <input
        className={cn(
          "w-full rounded-full border border-[#d8e4e8] bg-white/90 px-4 py-3 text-[#111c24] outline-none transition focus:border-[#72e1ee] focus:ring-4 focus:ring-[#72e1ee]/20",
          error &&
            "border-[#ef7373] focus:border-[#ef7373] focus:ring-[#ef7373]/15",
          className,
        )}
        ref={ref}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error && <p className="text-sm text-[#d94a4a]">{error}</p>}
    </div>
  ),
);

Input.displayName = "Input";
export default Input;
