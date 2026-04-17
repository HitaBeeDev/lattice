import { useTasks } from "../../context/TasksContext";
import UpcomingTaskGroup from "./UpcomingTaskGroup";

function UpcomingTasks() {
  const { upcomingTaskGroups } = useTasks();

  if (upcomingTaskGroups.length === 0) return null;

  return (
    <aside
      aria-labelledby="upcoming-tasks-heading h-fit"
      className="lg:sticky lg:top-6 lg:self-start"
    >
      <div className="overflow-hidden rounded-[1.7rem] h-fit">
        <div className="border-b border-[#f0f5f6] px-5 py-4">
          <p className="text-[1.1rem] font-[300] text-[#161c22]">Next up</p>
          <p className="mt-1 text-[0.72rem] font-[300] text-[#a0a5ab]">
            Future tasks that still need attention.
          </p>
        </div>

        {upcomingTaskGroups.map(({ date, tasks }, groupIndex) => (
          <UpcomingTaskGroup
            key={date}
            date={date}
            tasks={tasks}
            hasBorderTop={groupIndex > 0}
          />
        ))}
      </div>
    </aside>
  );
}

export default UpcomingTasks;
