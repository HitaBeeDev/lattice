import { useTasks } from "../../context/TasksContext";
import { EmptyState } from "../ui";
import TaskGroup from "./TaskGroup";

function TaskList() {
  const {
    handleTaskDelete,
    handleTaskEditClick,
    checkedTasks,
    handleCheckboxChange,
    handleTaskProgressChange,
    visibleTaskGroups,
  } = useTasks();

  if (visibleTaskGroups.length === 0) {
    return (
      <EmptyState
        className="rounded-[1.7rem] border border-dashed border-white/80 bg-white/45 px-6 py-12 shadow-[0_18px_55px_rgba(80,111,122,0.08)]"
        description="Looks like you're all caught up. There are no tasks on the list right now."
        title="Nothing scheduled"
      />
    );
  }

  return (
    <section>
      <div>
        {visibleTaskGroups.map(({ date, tasks }) => (
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

export default TaskList;
