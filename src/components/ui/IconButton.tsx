/* eslint-disable react/prop-types */
import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "./cn";

const SIZE_STYLES = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-12 w-12",
} as const;

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: keyof typeof SIZE_STYLES;
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size = "md", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white/85 text-slate-700 transition duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        SIZE_STYLES[size],
        className
      )}
      {...props}
    />
  )
);

IconButton.displayName = "IconButton";

export default IconButton;
