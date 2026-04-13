import type { FieldError, UseFormRegister } from "react-hook-form";
import type { TaskFormValues } from "../../lib/taskSchema";
import { Input } from "../ui";
type TaskInputFieldProps = {
    error?: FieldError;
    id: keyof TaskFormValues;
    label: string;
    placeholder?: string;
    register: UseFormRegister<TaskFormValues>;
    type: "date" | "text" | "time";
    autoFocus?: boolean;
};
export function TaskInputField({ autoFocus, error, id, label, placeholder, register, type, }: TaskInputFieldProps) {
    return (<div>
      <label htmlFor={id}>
        {label}
      </label>
      <Input autoFocus={autoFocus} id={id} error={error?.message} placeholder={placeholder} type={type} {...register(id)}/>
    </div>);
}
