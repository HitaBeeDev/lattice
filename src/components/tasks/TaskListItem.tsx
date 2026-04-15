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
export default function TaskListItem({ isChecked, onDelete, onEdit, onMarkInProgress, onToggle, task, }: TaskListItemProps) {
    const checkboxId = `task-complete-${task.id}`;
    return (<li>
      <div>
        <div>
          <div>
            <input id={checkboxId} type="checkbox" checked={isChecked} onChange={onToggle}/>

            <div>
              <label htmlFor={checkboxId}>
                {task.name}
              </label>
              {task.description ? (<p>{task.description}</p>) : null}
            </div>
          </div>

          <div>
            <p>{task.date}</p>
            {task.startTime ? <p>{task.startTime}</p> : null}
            <Badge variant={PRIORITY_VARIANTS[task.priority]}>
              {task.priority}
            </Badge>
          </div>
        </div>

        <div>
          {!task.isCompleted ? (<Button onClick={onMarkInProgress} size="sm" variant="ghost">
              {task.status === "in_progress" ? "Stop progress" : "Start task"}
            </Button>) : null}
          <Button onClick={onEdit} size="sm" variant="ghost">
            Edit
          </Button>
          <Button onClick={onDelete} size="sm" variant="danger">
            Delete
          </Button>
        </div>
      </div>
    </li>);
}
