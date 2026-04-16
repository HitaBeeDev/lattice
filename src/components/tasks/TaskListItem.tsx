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
  onMarkInProgress,
  onToggle,
  task,
}: TaskListItemProps) {
  const checkboxId = `task-complete-${task.id}`;
  const inProgressId = `task-progress-${task.id}`;
  const isInProgress = task.status === "in_progress" && !task.isCompleted;

  return (
    <li className="group flex items-center justify-between gap-6 border-b border-[#f0f5f6] px-5 py-4 transition hover:bg-[#fafcfc] last:border-0">
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

      <div className="flex flex-shrink-0 items-center justify-end gap-4">
        <div className="flex w-3 justify-center">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}
            title={task.priority}
          />
        </div>

        <div className="flex w-[7.5rem] justify-start">
          {task.startTime ? (
            <div className="flex items-center gap-1.5 rounded-full bg-[#f5f8f9] px-2.5 py-1 text-[0.65rem] text-[#a0a5ab]">
              <Clock3 className="h-3 w-3" />
              <span>
                {task.startTime}
                {task.endTime ? ` – ${task.endTime}` : ""}
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex w-[8.5rem] justify-start">
          <label
            htmlFor={inProgressId}
            className={cn(
              "flex items-center gap-2 rounded-full border px-2.5 py-1 text-[0.65rem] transition",
              task.isCompleted
                ? "cursor-not-allowed border-[#eef2f4] bg-[#f8fafb] text-[#c0c7cc]"
                : isInProgress
                  ? "border-[#161c22] bg-[#161c22] text-white"
                  : "cursor-pointer border-[#dde4e8] bg-white text-[#7b858c] hover:border-[#b0bec5]",
            )}
          >
            <input
              id={inProgressId}
              type="checkbox"
              checked={isInProgress}
              onChange={onMarkInProgress}
              disabled={task.isCompleted}
              className="sr-only"
            />
            <span
              className={cn(
                "flex h-3.5 w-3.5 items-center justify-center rounded-full border transition",
                task.isCompleted
                  ? "border-[#d9e0e4]"
                  : isInProgress
                    ? "border-white/30 bg-white/10"
                    : "border-[#cfd8dd] bg-transparent",
              )}
              aria-hidden="true"
            >
              {isInProgress ? <Check className="h-2.5 w-2.5" /> : null}
            </span>
            <span>{task.isCompleted ? "Done" : "In progress"}</span>
          </label>
        </div>

        <div className="flex w-12 items-center justify-end gap-3 opacity-0 transition group-hover:opacity-100">
          <button
            type="button"
            aria-label={`Edit ${task.name}`}
            onClick={onEdit}
            className="text-[#a0a5ab] transition hover:text-[#161c22]"
          >
            <PencilLine className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            aria-label={`Delete ${task.name}`}
            onClick={onDelete}
            className="text-[#ef4444] transition"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </li>
  );
}
