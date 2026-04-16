import { cn } from "../ui/cn";
import { PRIORITY_OPTIONS, type TaskFormValues } from "../../lib/taskSchema";
import type { Priority } from "../../types/task";

const PRIORITY_DOT_CLASSES: Record<Priority, string> = {
  High: "bg-[#ef4444]",
  Medium: "bg-[#f59e0b]",
  Low: "bg-[#22c55e]",
};

type QuickAddPriorityPickerProps = {
  error?: string;
  onSelect: (priority: Priority) => void;
  selectedPriority: TaskFormValues["priority"];
};

export default function QuickAddPriorityPicker({
  error,
  onSelect,
  selectedPriority,
}: QuickAddPriorityPickerProps) {
  return (
    <div>
      <p className="text-[0.6rem] font-[500] text-[#d3d6d9] mb-1.5">Priority</p>
      <div className="flex gap-1.5">
        {PRIORITY_OPTIONS.map((priority) => (
          <button
            key={priority}
            type="button"
            aria-pressed={selectedPriority === priority}
            onClick={() => onSelect(priority)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 rounded-[0.5rem] border py-1.5 text-[0.65rem] font-[400] transition",
              selectedPriority === priority
                ? "border-[#161c22] bg-[#161c22] text-white"
                : "border-[#e0e9ed] text-[#a0a6ab] hover:border-[#b0bec5]",
            )}
          >
            <div className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", PRIORITY_DOT_CLASSES[priority])} />
            {priority}
          </button>
        ))}
      </div>
      {error && <p className="text-[0.7rem] text-[#ef4444] mt-1">{error}</p>}
    </div>
  );
}
