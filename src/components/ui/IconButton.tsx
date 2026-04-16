/* eslint-disable react/prop-types */
import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "./cn";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    size?: "sm" | "md" | "lg";
};

const SIZE_CLASSES = {
    sm: "h-8 w-8",
    md: "h-9 w-9",
    lg: "h-10 w-10",
} as const;

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({ className, size = "md", type = "button", ...props }, ref) => (<button ref={ref} type={type} className={cn("inline-flex items-center justify-center rounded-full", SIZE_CLASSES[size], className)} {...props}/>));
IconButton.displayName = "IconButton";
export default IconButton;
