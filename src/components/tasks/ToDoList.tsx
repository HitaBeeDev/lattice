import { useTasks } from "../../context/TasksContext";
import TaskGroup from "./TaskGroup";
import { EmptyState } from "../ui";
function ToDoList() {
    const { handleTaskDelete, handleTaskEditClick, checkedTasks, handleCheckboxChange, sortedTasks, } = useTasks();
    if (sortedTasks.length === 0) {
        return (<EmptyState description="Looks like you&apos;re all caught up. There are no to-dos on the list right now." title="Nothing scheduled"/>);
    }
    return (<section>
      <div>
        <p>
          Active board
        </p>
        <h2>
          Scheduled tasks
        </h2>
      </div>
      {sortedTasks.map(([date, tasks]) => (<TaskGroup key={date} checkedTasks={checkedTasks} date={date} onDeleteTask={handleTaskDelete} onEditTask={handleTaskEditClick} onToggleTask={handleCheckboxChange} tasks={tasks}/>))}
    </section>);
}
export default ToDoList;
