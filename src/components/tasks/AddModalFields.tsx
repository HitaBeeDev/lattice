import type { FieldError, UseFormRegister } from "react-hook-form";
import type { TaskFormValues } from "../../lib/taskSchema";
import Input from "../ui/Input";

type TaskInputFieldProps = {
  error?: FieldError;
  id: keyof TaskFormValues;
  label: string;
  placeholder?: string;
  register: UseFormRegister<TaskFormValues>;
  type: "date" | "text" | "time";
};

export function TaskInputField({
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
        id={id}
        error={error?.message}
        placeholder={placeholder}
        type={type}
        {...register(id)}
      />
    </div>
  );
}
