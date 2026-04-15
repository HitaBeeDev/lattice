import type { FieldError, UseFormRegister } from "react-hook-form";
import type { TaskFormValues } from "../../lib/taskSchema";
import { Input } from "../ui";

type TaskInputFieldProps = {
  autoFocus?: boolean;
  error?: FieldError;
  id: keyof TaskFormValues;
  label: string;
  placeholder?: string;
  register: UseFormRegister<TaskFormValues>;
  type: "date" | "text" | "time";
};

export function TaskInputField({
  autoFocus,
  error,
  id,
  label,
  placeholder,
  register,
  type,
}: TaskInputFieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-[0.65rem] font-[400] text-[#a0a5ab] uppercase tracking-widest"
      >
        {label}
      </label>
      <Input
        autoFocus={autoFocus}
        id={id}
        error={error?.message}
        placeholder={placeholder}
        type={type}
        className="rounded-[0.6rem] border-[#e8edf0] text-[0.85rem] h-10 px-3 focus:border-[#161c22] focus:ring-[#161c22]/10"
        {...register(id)}
      />
    </div>
  );
}
