import type { FieldError, UseFormRegister } from "react-hook-form";
import type { TaskFormValues } from "../../lib/taskSchema";
import { Input } from "../ui";

type TaskInputFieldProps = {
  className?: string;
  error?: FieldError;
  id: keyof TaskFormValues;
  label: string;
  placeholder?: string;
  register: UseFormRegister<TaskFormValues>;
  type: "date" | "text" | "time";
  autoFocus?: boolean;
};

export function TaskInputField({
  autoFocus,
  className,
  error,
  id,
  label,
  placeholder,
  register,
  type,
}: TaskInputFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <Input
        autoFocus={autoFocus}
        className={className}
        id={id}
        error={error?.message}
        placeholder={placeholder}
        type={type}
        {...register(id)}
      />
    </div>
  );
}
