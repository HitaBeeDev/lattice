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
export default function TaskGroup({ checkedTasks, date, onDeleteTask, onEditTask, onMarkTaskInProgress, onToggleTask, tasks, }: TaskGroupProps) {
    return (<div>
      <p>
        {date}
      </p>
      <ul>
        {tasks.map((task) => (<TaskListItem key={task.id} isChecked={checkedTasks.includes(task.id)} onDelete={() => onDeleteTask(task.id)} onEdit={() => onEditTask(task.id)} onMarkInProgress={() => onMarkTaskInProgress(task.id)} onToggle={() => onToggleTask(task.id)} task={task}/>))}
      </ul>
    </div>);
}
