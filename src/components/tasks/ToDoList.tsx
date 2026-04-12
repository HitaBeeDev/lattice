import { useTasks } from "../../context/TasksContext";
import TaskGroup from "./TaskGroup";
import { EmptyState } from "../ui";

function ToDoList() {
  const {
    handleTaskDelete,
    handleTaskEditClick,
    checkedTasks,
    handleCheckboxChange,
    sortedTasks,
  } = useTasks();

  if (sortedTasks.length === 0) {
    return (
      <EmptyState
        description="Looks like you&apos;re all caught up. There are no to-dos on the list right now."
        title="Nothing scheduled"
      />
    );
  }

  return (
    <section className="app-card space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          Active board
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
          Scheduled tasks
        </h2>
      </div>
      {sortedTasks.map(([date, tasks]) => (
        <TaskGroup
          key={date}
          checkedTasks={checkedTasks}
          date={date}
          onDeleteTask={handleTaskDelete}
          onEditTask={handleTaskEditClick}
          onToggleTask={handleCheckboxChange}
          tasks={tasks}
        />
      ))}
    </section>
  );
}

export default ToDoList;
