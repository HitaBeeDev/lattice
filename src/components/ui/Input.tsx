/* eslint-disable react/prop-types */
import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    error?: string;
};
const Input = forwardRef<HTMLInputElement, InputProps>(({ error, ...props }, ref) => (<div>
      <input ref={ref} aria-invalid={Boolean(error)} {...props}/>
      {error && <p>{error}</p>}
    </div>));
Input.displayName = "Input";
export default Input;
