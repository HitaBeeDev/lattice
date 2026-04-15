import { Check, Clock3, PencilLine, Trash2 } from "lucide-react";
import { cn } from "../ui/cn";
import type { Priority, Task } from "../../types/task";

const PRIORITY_COLORS: Record<Priority, string> = {
  High: "#ef4444",
  Medium: "#f59e0b",
  Low: "#22c55e",
};

type TaskListItemProps = {
  isChecked: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onMarkInProgress: () => void;
  onToggle: () => void;
  task: Task;
};

export default function TaskListItem({
  isChecked,
  onDelete,
  onEdit,
  onToggle,
  task,
}: TaskListItemProps) {
  const checkboxId = `task-complete-${task.id}`;

  return (
    <li className="flex items-center gap-4 px-5 py-4 border-b border-[#f0f5f6] last:border-0 hover:bg-[#fafcfc] transition group">
      {/* Checkbox */}
      <button
        type="button"
        aria-label={`Mark ${task.name} as ${isChecked ? "incomplete" : "complete"}`}
        aria-pressed={isChecked}
        onClick={onToggle}
        className={cn(
          "flex-shrink-0 flex items-center justify-center h-5 w-5 rounded-full border transition",
          isChecked
            ? "bg-[#06090f] border-[#06090f]"
            : "border-[#dde4e8] hover:border-[#b0bec5]",
        )}
      >
        {isChecked && <Check className="w-3 h-3 text-white" />}
      </button>

      {/* Name + description */}
      <label
        htmlFor={checkboxId}
        className="flex-1 min-w-0 cursor-pointer"
      >
        <input
          id={checkboxId}
          type="checkbox"
          checked={isChecked}
          onChange={onToggle}
          className="sr-only"
        />
        <p
          className={cn(
            "text-[0.85rem] font-[500] leading-none text-[#161c22] truncate",
            isChecked && "line-through text-[#a0a5ab]",
          )}
        >
          {task.name}
        </p>
        {task.description ? (
          <p className="text-[0.7rem] font-[300] text-[#a0a5ab] mt-1 truncate">
            {task.description}
          </p>
        ) : null}
      </label>

      {/* Priority dot */}
      <div
        className="flex-shrink-0 h-2 w-2 rounded-full"
        style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}
        title={task.priority}
      />

      {/* Time chip */}
      {task.startTime ? (
        <div className="flex items-center gap-1.5 text-[0.65rem] text-[#a0a5ab] bg-[#f5f8f9] rounded-full px-2.5 py-1 flex-shrink-0">
          <Clock3 className="w-3 h-3" />
          <span>
            {task.startTime}
            {task.endTime ? ` – ${task.endTime}` : ""}
          </span>
        </div>
      ) : null}

      {/* Actions */}
      <div className="flex items-center gap-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition">
        <button
          type="button"
          aria-label={`Edit ${task.name}`}
          onClick={onEdit}
          className="text-[#a0a5ab] hover:text-[#161c22] transition"
        >
          <PencilLine className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          aria-label={`Delete ${task.name}`}
          onClick={onDelete}
          className="text-[#ef4444] transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </li>
  );
}
