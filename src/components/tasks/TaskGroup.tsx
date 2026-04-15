import type { Task } from "../../types/task";
import TaskListItem from "./TaskListItem";

type TaskGroupProps = {
  checkedTasks: string[];
  date: string;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (taskId: string) => void;
  onMarkTaskInProgress: (taskId: string) => void;
  onToggleTask: (taskId: string) => void;
  tasks: Task[];
};

export default function TaskGroup({
  checkedTasks,
  date,
  onDeleteTask,
  onEditTask,
  onMarkTaskInProgress,
  onToggleTask,
  tasks,
}: TaskGroupProps) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-[rgba(242,249,249,0.8)] p-5 shadow-[0_18px_55px_rgba(80,111,122,0.1)] backdrop-blur-xl">
      <div className="mb-4 rounded-[1.35rem] bg-white/70 px-4 py-3">
        <p className="text-sm font-medium text-[#1b2830]">{date}</p>
      </div>

      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tasks.map((task) => (
          <TaskListItem
            key={task.id}
            isChecked={checkedTasks.includes(task.id)}
            onDelete={() => onDeleteTask(task.id)}
            onEdit={() => onEditTask(task.id)}
            onMarkInProgress={() => onMarkTaskInProgress(task.id)}
            onToggle={() => onToggleTask(task.id)}
            task={task}
          />
        ))}
      </ul>
    </section>
  );
}
