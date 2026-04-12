import type { TaskEntry } from "../../db/database";
import TaskListItem from "./TaskListItem";

type TaskGroupProps = {
  checkedTasks: string[];
  date: string;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (taskId: string) => void;
  onToggleTask: (taskId: string) => void;
  tasks: TaskEntry[];
};

export default function TaskGroup({
  checkedTasks,
  date,
  onDeleteTask,
  onEditTask,
  onToggleTask,
  tasks,
}: TaskGroupProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        {date}
      </p>
      <ul className="space-y-3">
        {tasks.map((task) => (
          <TaskListItem
            key={task.id}
            isChecked={checkedTasks.includes(task.id)}
            onDelete={() => onDeleteTask(task.id)}
            onEdit={() => onEditTask(task.id)}
            onToggle={() => onToggleTask(task.id)}
            task={task}
          />
        ))}
      </ul>
    </div>
  );
}
