import type { FieldError, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { cn } from "../ui/cn";
import { PRIORITY_OPTIONS, type TaskFormValues } from "../../lib/taskSchema";
import type { Priority } from "../../types/task";

const PRIORITY_DOT_CLASSES: Record<Priority, string> = {
  High: "bg-[#ef4444]",
  Medium: "bg-[#f59e0b]",
  Low: "bg-[#22c55e]",
};

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
    <div className="space-y-1.5">
      <p className="text-[0.65rem] font-[400] text-[#a0a5ab] uppercase tracking-widest">
        Priority
      </p>

      <input type="hidden" {...register("priority")} />

      <div className="flex gap-2">
        {PRIORITY_OPTIONS.map((priority) => (
          <button
            key={priority}
            type="button"
            aria-pressed={selectedPriority === priority}
            onClick={() => setValue("priority", priority, { shouldValidate: true })}
            className={cn(
              "flex items-center gap-1.5 h-8 px-3 rounded-full text-[0.75rem] border transition",
              selectedPriority === priority
                ? "bg-[#161c22] text-white border-[#161c22]"
                : "bg-white text-[#a0a5ab] border-[#dde4e8] hover:border-[#b0bec5]",
            )}
          >
            <div className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${PRIORITY_DOT_CLASSES[priority]}`} />
            {priority}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-[0.7rem] text-[#ef4444]">{error.message}</p>
      )}
    </div>
  );
}
