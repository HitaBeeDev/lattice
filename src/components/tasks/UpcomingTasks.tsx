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

const getTodayKey = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function UpcomingTasks() {
  const { groupedTasks, checkedTasks } = useTasks();
  const todayKey = getTodayKey();

  const entries = Object.entries(groupedTasks)
    .sort(byDate)
    .map(([date, tasks]) => ({
      date,
      tasks: tasks.filter((t) => !checkedTasks.includes(t.id)),
    }))
    .filter(({ date, tasks }) => date > todayKey && tasks.length > 0);

  if (entries.length === 0) return null;

  return (
    <aside
      aria-labelledby="upcoming-tasks-heading"
      className="lg:sticky lg:top-6 lg:self-start"
    >
      <div className="overflow-hidden rounded-[1.7rem] bg-white shadow-[0_18px_45px_rgba(80,111,122,0.08)]">
        <div className="border-b border-[#f0f5f6] px-5 py-4">
          <p className="text-[1.1rem] font-[300] text-[#161c22]">Next up</p>
          <p className="mt-1 text-[0.72rem] font-[300] text-[#a0a5ab]">
            Future tasks that still need attention.
          </p>
        </div>

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
                  className="flex items-start gap-4 px-5 py-4 border-b border-[#f0f5f6] last:border-0"
                >
                  <div
                    className="flex-shrink-0 w-2 h-2 mt-1 rounded-full"
                    style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}
                    title={task.priority}
                  />

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
    </aside>
  );
}

export default UpcomingTasks;
