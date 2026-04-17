import { memo, useCallback } from "react";
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
  onDelete: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  onMarkInProgress: (taskId: string) => void;
  onToggle: (taskId: string) => void;
  task: Task;
};

function TaskListItem({
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

  const handleDelete = useCallback(() => onDelete(task.id), [onDelete, task.id]);
  const handleEdit = useCallback(() => onEdit(task.id), [onEdit, task.id]);
  const handleMarkInProgress = useCallback(() => onMarkInProgress(task.id), [onMarkInProgress, task.id]);
  const handleToggle = useCallback(() => onToggle(task.id), [onToggle, task.id]);

  return (
    <li className="group border-b border-[#f0f5f6] px-5 py-4 transition hover:bg-[#fafcfc] last:border-0">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between xl:gap-6">
        <TaskItemInfo
          checkboxId={checkboxId}
          isChecked={isChecked}
          task={task}
          onToggle={handleToggle}
        />

        <div className="flex flex-wrap items-center gap-3 xl:flex-shrink-0 xl:flex-nowrap xl:justify-end xl:gap-4">
          <div className="flex w-3 justify-center">
            <div
              className={cn("h-2 w-2 rounded-full", PRIORITY_DOT_CLASSES[task.priority])}
              title={task.priority}
            />
          </div>

          <div className="flex justify-start xl:w-[7.5rem]">
            <TaskTimeChip startTime={task.startTime} endTime={task.endTime} />
          </div>

          <div className="flex justify-start xl:w-[8.5rem]">
            <TaskStatusBadge
              isCompleted={task.isCompleted}
              isInProgress={isInProgress}
              inputId={inProgressId}
              taskName={task.name}
              onMarkInProgress={handleMarkInProgress}
            />
          </div>

          <TaskActionButtons taskName={task.name} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </div>
    </li>
  );
}

const MemoizedTaskListItem = memo(TaskListItem);

export default MemoizedTaskListItem;
