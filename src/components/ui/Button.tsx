/* eslint-disable react/prop-types */
import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    size?: "sm" | "md" | "lg";
    variant?: "primary" | "secondary" | "ghost" | "danger";
};
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ size = "md", type = "button", variant = "primary", ...props }, ref) => (<button ref={ref} type={type} {...props}/>));
Button.displayName = "Button";
export default Button;
