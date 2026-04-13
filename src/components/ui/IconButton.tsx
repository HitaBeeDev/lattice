/* eslint-disable react/prop-types */
import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    size?: "sm" | "md" | "lg";
};
const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({ size = "md", type = "button", ...props }, ref) => (<button ref={ref} type={type} {...props}/>));
IconButton.displayName = "IconButton";
export default IconButton;
