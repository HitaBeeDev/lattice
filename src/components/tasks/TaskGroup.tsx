import { memo } from "react";
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

function TaskGroup({
  checkedTasks,
  date,
  onDeleteTask,
  onEditTask,
  onMarkTaskInProgress,
  onToggleTask,
  tasks,
}: TaskGroupProps) {
  return (
    <section className="mx-5 mt-3 bg-white rounded-[1rem] overflow-hidden">
      <div className="flex items-center px-5 py-3 border-b border-[#f0f5f6]">
        <p className="text-[0.65rem] font-[400] text-[#a0a5ab] uppercase tracking-widest">
          {date}
        </p>
      </div>

      <ul>
        {tasks.map((task) => (
          <TaskListItem
            key={task.id}
            isChecked={checkedTasks.includes(task.id)}
            onDelete={onDeleteTask}
            onEdit={onEditTask}
            onMarkInProgress={onMarkTaskInProgress}
            onToggle={onToggleTask}
            task={task}
          />
        ))}
      </ul>
    </section>
  );
}

export default memo(TaskGroup);
