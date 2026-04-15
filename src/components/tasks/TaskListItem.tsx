import { Clock3, PencilLine, Play, Trash2 } from "lucide-react";
import type { Task } from "../../types/task";
import { Badge, Button } from "../ui";

const PRIORITY_VARIANTS = {
  High: "high",
  Medium: "medium",
  Low: "low",
} as const;

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

  return (
    <li className="h-full">
      <article className="flex h-full flex-col gap-4 rounded-[1.5rem] border border-white/80 bg-white/75 p-4 shadow-[0_12px_28px_rgba(96,120,130,0.08)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <input
              checked={isChecked}
              className="mt-1 h-4 w-4 rounded border-[#bfd3d9] text-[#72e1ee] focus:ring-[#72e1ee]/30"
              id={checkboxId}
              onChange={onToggle}
              type="checkbox"
            />

            <div className="min-w-0">
              <label
                className={`block cursor-pointer text-base font-medium text-[#101820] ${isChecked ? "line-through opacity-55" : ""}`}
                htmlFor={checkboxId}
              >
                {task.name}
              </label>
              {task.description ? (
                <p className="mt-2 text-sm leading-6 text-[#637983]">
                  {task.description}
                </p>
              ) : null}
            </div>
          </div>

          <Badge variant={PRIORITY_VARIANTS[task.priority]}>
            {task.priority}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-[#607680]">
          <div className="rounded-full bg-[#f2f7f8] px-3 py-2">{task.date}</div>
          {task.startTime ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f2f7f8] px-3 py-2">
              <Clock3 className="h-4 w-4" />
              <span>
                {task.startTime}
                {task.endTime ? ` - ${task.endTime}` : ""}
              </span>
            </div>
          ) : null}
        </div>

        <div className="mt-auto flex flex-wrap gap-3">
          {!task.isCompleted ? (
            <Button
              className="rounded-[1rem]"
              onClick={onMarkInProgress}
              size="sm"
              variant="ghost"
            >
              <Play className="h-4 w-4" />
              {task.status === "in_progress" ? "Stop progress" : "Start task"}
            </Button>
          ) : null}

          <Button
            className="rounded-[1rem]"
            onClick={onEdit}
            size="sm"
            variant="ghost"
          >
            <PencilLine className="h-4 w-4" />
            Edit
          </Button>

          <Button
            className="rounded-[1rem]"
            onClick={onDelete}
            size="sm"
            variant="danger"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </article>
    </li>
  );
}
