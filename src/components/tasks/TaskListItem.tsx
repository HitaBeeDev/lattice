import type { TaskEntry } from "../../db/database";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

const PRIORITY_VARIANTS = {
  High: "high",
  Medium: "medium",
  Low: "low",
} as const;

type TaskListItemProps = {
  isChecked: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onToggle: () => void;
  task: TaskEntry;
};

export default function TaskListItem({
  isChecked,
  onDelete,
  onEdit,
  onToggle,
  task,
}: TaskListItemProps) {
  return (
    <li className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <input
              className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-300"
              type="checkbox"
              checked={isChecked}
              onChange={onToggle}
            />

            <div className="space-y-1">
              <p className="font-semibold text-slate-900">{task.name}</p>
              <p className="text-sm text-slate-600">{task.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
            <p>{task.date}</p>
            <p>
              {task.startTime} - {task.endTime}
            </p>
            <Badge variant={PRIORITY_VARIANTS[task.priority]}>
              {task.priority}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={onEdit} size="sm" variant="ghost">
            Edit
          </Button>
          <Button onClick={onDelete} size="sm" variant="danger">
            Delete
          </Button>
        </div>
      </div>
    </li>
  );
}
