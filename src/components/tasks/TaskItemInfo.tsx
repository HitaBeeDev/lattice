import { Check } from "lucide-react";
import { cn } from "../ui/cn";
import type { Task } from "../../types/task";

type TaskItemInfoProps = {
  checkboxId: string;
  isChecked: boolean;
  onToggle: () => void;
  task: Task;
};

export default function TaskItemInfo({ checkboxId, isChecked, onToggle, task }: TaskItemInfoProps) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-4">
      <button
        type="button"
        aria-label={`Mark ${task.name} as ${isChecked ? "incomplete" : "complete"}`}
        aria-pressed={isChecked}
        onClick={onToggle}
        className={cn(
          "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition",
          isChecked
            ? "border-[#06090f] bg-[#06090f]"
            : "border-[#dde4e8] hover:border-[#b0bec5]",
        )}
      >
        {isChecked && <Check className="h-3 w-3 text-white" />}
      </button>

      <label htmlFor={checkboxId} className="min-w-0 flex-1 cursor-pointer">
        <input
          id={checkboxId}
          type="checkbox"
          checked={isChecked}
          onChange={onToggle}
          className="sr-only"
        />
        <p
          className={cn(
            "truncate text-[0.85rem] font-[500] leading-none text-[#161c22]",
            isChecked && "line-through text-[#a0a5ab]",
          )}
        >
          {task.name}
        </p>
        {task.description ? (
          <p className="mt-1 truncate text-[0.7rem] font-[300] text-[#a0a5ab]">
            {task.description}
          </p>
        ) : null}
      </label>
    </div>
  );
}
