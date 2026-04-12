/* eslint-disable react/prop-types */
import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "./cn";

const VARIANT_STYLES = {
  primary:
    "border border-transparent bg-[var(--app-accent)] text-slate-950 shadow-[0_18px_35px_rgba(217,242,71,0.25)] hover:-translate-y-0.5 hover:brightness-95 focus-visible:ring-[var(--app-accent)]",
  secondary:
    "border border-black/10 bg-white/85 text-slate-900 hover:bg-white focus-visible:ring-slate-300",
  ghost:
    "border border-transparent bg-transparent text-slate-700 hover:bg-black/5 focus-visible:ring-slate-300",
  danger:
    "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 focus-visible:ring-rose-300",
} as const;

const SIZE_STYLES = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
} as const;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: keyof typeof SIZE_STYLES;
  variant?: keyof typeof VARIANT_STYLES;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size = "md", type = "button", variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        className
      )}
      {...props}
    />
  )
);

Button.displayName = "Button";

export default Button;
