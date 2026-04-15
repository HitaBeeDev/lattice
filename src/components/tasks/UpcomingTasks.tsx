import { Clock3 } from "lucide-react";
import { useTasks } from "../../context/TasksContext";
import { cn } from "../ui/cn";
import type { Priority } from "../../types/task";

const PRIORITY_COLORS: Record<Priority, string> = {
  High: "#ef4444",
  Medium: "#f59e0b",
  Low: "#22c55e",
};

const byDate = ([dateA]: [string, unknown], [dateB]: [string, unknown]) =>
  new Date(dateA).getTime() - new Date(dateB).getTime();

function UpcomingTasks() {
  const { groupedTasks, checkedTasks } = useTasks();

  const entries = Object.entries(groupedTasks)
    .sort(byDate)
    .map(([date, tasks]) => ({
      date,
      tasks: tasks.filter((t) => !checkedTasks.includes(t.id)),
    }))
    .filter(({ tasks }) => tasks.length > 0);

  if (entries.length === 0) return null;

  return (
    <section aria-labelledby="upcoming-tasks-heading" className="px-5 mt-3">
      <p
        className="text-[0.65rem] font-[300] text-[#a0a5ab] uppercase tracking-widest mb-3"
        id="upcoming-tasks-heading"
      >
        Upcoming
      </p>

      <div className="bg-white rounded-[1rem] overflow-hidden">
        {entries.map(({ date, tasks }, groupIndex) => (
          <div
            key={date}
            className={cn(groupIndex > 0 && "border-t border-[#f0f5f6]")}
          >
            <div className="flex items-center px-5 py-3 border-b border-[#f0f5f6]">
              <p className="text-[0.65rem] font-[400] text-[#a0a5ab] uppercase tracking-widest">
                {date}
              </p>
            </div>

            <ul>
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center gap-4 px-5 py-4 border-b border-[#f0f5f6] last:border-0"
                >
                  {/* Priority dot */}
                  <div
                    className="flex-shrink-0 h-2 w-2 rounded-full"
                    style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}
                    title={task.priority}
                  />

                  {/* Name + description */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.85rem] font-[500] leading-none text-[#161c22] truncate">
                      {task.name}
                    </p>
                    {task.description ? (
                      <p className="text-[0.7rem] font-[300] text-[#a0a5ab] mt-1 truncate">
                        {task.description}
                      </p>
                    ) : null}
                  </div>

                  {/* Time chip */}
                  {task.startTime ? (
                    <div className="flex items-center gap-1.5 text-[0.65rem] text-[#a0a5ab] bg-[#f5f8f9] rounded-full px-2.5 py-1 flex-shrink-0">
                      <Clock3 className="w-3 h-3" />
                      <span>
                        {task.startTime}
                        {task.endTime ? ` – ${task.endTime}` : ""}
                      </span>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default UpcomingTasks;
