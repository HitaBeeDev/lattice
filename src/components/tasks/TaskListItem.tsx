import { cn } from "../ui/cn";
import type { Priority, Task } from "../../types/task";
import TaskTimeChip from "./TaskTimeChip";
import TaskStatusBadge from "./TaskStatusBadge";
import TaskActionButtons from "./TaskActionButtons";
import TaskItemInfo from "./TaskItemInfo";

const PRIORITY_DOT_CLASSES: Record<Priority, string> = {
  High: "bg-[#ef4444]",
  Medium: "bg-[#f59e0b]",
  Low: "bg-[#22c55e]",
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
      <TaskItemInfo
        checkboxId={checkboxId}
        isChecked={isChecked}
        task={task}
        onToggle={onToggle}
      />

      <div className="flex flex-shrink-0 items-center justify-end gap-4">
        <div className="flex w-3 justify-center">
          <div
            className={cn("h-2 w-2 rounded-full", PRIORITY_DOT_CLASSES[task.priority])}
            title={task.priority}
          />
        </div>

        <div className="flex w-[7.5rem] justify-start">
          <TaskTimeChip startTime={task.startTime} endTime={task.endTime} />
        </div>

        <div className="flex w-[8.5rem] justify-start">
          <TaskStatusBadge
            isCompleted={task.isCompleted}
            isInProgress={isInProgress}
            inputId={inProgressId}
            taskName={task.name}
            onMarkInProgress={onMarkInProgress}
          />
        </div>

        <TaskActionButtons taskName={task.name} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </li>
  );
}
