import { useTasks } from "../../context/TasksContext";
import { EmptyState } from "../ui";
import TaskGroup from "./TaskGroup";

function ToDoList() {
  const {
    handleTaskDelete,
    handleTaskEditClick,
    checkedTasks,
    handleCheckboxChange,
    handleTaskProgressChange,
    sortedTasks,
  } = useTasks();

  if (sortedTasks.length === 0) {
    return (
      <EmptyState
        className="rounded-[2rem] border border-dashed border-white/80 bg-white/45 px-6 py-12 shadow-[0_18px_55px_rgba(80,111,122,0.08)]"
        description="Looks like you're all caught up. There are no to-dos on the list right now."
        title="Nothing scheduled"
      />
    );
  }

  return (
    <section>
      <div>
        {sortedTasks.map(([date, tasks]) => (
          <TaskGroup
            key={date}
            checkedTasks={checkedTasks}
            date={date}
            onDeleteTask={handleTaskDelete}
            onEditTask={handleTaskEditClick}
            onMarkTaskInProgress={handleTaskProgressChange}
            onToggleTask={handleCheckboxChange}
            tasks={tasks}
          />
        ))}
      </div>
    </section>

  );
}

export default ToDoList;
