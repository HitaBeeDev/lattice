/* eslint-disable react/prop-types */
import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "./cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const sizeClasses = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

const variantClasses = {
  primary: "bg-[#161c22] text-white hover:bg-[#0f1419]",
  secondary: "bg-[#72e1ee] text-white hover:bg-[#5fd0de]",
  ghost: "border border-white/80 bg-white/72 text-[#1b2830] hover:bg-white",
  danger: "bg-[#f26d6d] text-white hover:bg-[#e05f5f]",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size = "md", type = "button", variant = "primary", ...props }, ref) => (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#161c22]/20 disabled:cursor-not-allowed disabled:opacity-60",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      ref={ref}
      type={type}
      {...props}
    />
  ),
);

Button.displayName = "Button";
export default Button;
