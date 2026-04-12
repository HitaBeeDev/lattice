import type { FieldError, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { PRIORITY_OPTIONS, type TaskFormValues } from "../../lib/taskSchema";
import Button from "../ui/Button";

type PrioritySelectorProps = {
  error?: FieldError;
  register: UseFormRegister<TaskFormValues>;
  selectedPriority: TaskFormValues["priority"];
  setValue: UseFormSetValue<TaskFormValues>;
};

export default function PrioritySelector({
  error,
  register,
  selectedPriority,
  setValue,
}: PrioritySelectorProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-slate-700">Please choose a priority tag:</p>
      <input type="hidden" {...register("priority")} />
      <div className="flex flex-wrap gap-2">
        {PRIORITY_OPTIONS.map((priority) => (
          <Button
            key={priority}
            className="min-w-28"
            onClick={() => setValue("priority", priority, { shouldValidate: true })}
            aria-pressed={selectedPriority === priority}
            size="sm"
            type="button"
            variant={selectedPriority === priority ? "primary" : "secondary"}
          >
            {priority} Priority
          </Button>
        ))}
      </div>
      {error && <p className="text-sm text-rose-600">{error.message}</p>}
    </div>
  );
}
