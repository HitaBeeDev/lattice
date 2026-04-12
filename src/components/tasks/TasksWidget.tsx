import type { TaskEntry } from "../../db/database";
import { useTasks } from "../../context/TasksContext";
import Badge from "../ui/Badge";
import EmptyState from "../ui/EmptyState";

const PRIORITY_VARIANTS = {
  High: "high",
  Medium: "medium",
  Low: "low",
} as const;

const MAX_GROUPS = 2;
const MAX_TASKS_PER_GROUP = 2;

const byDate = ([dateA]: [string, TaskEntry[]], [dateB]: [string, TaskEntry[]]) =>
  new Date(dateA).getTime() - new Date(dateB).getTime();

const getUpcomingTasks = (
  groupedTasks: Record<string, TaskEntry[]>,
  checkedTasks: string[]
) =>
  Object.entries(groupedTasks)
  .sort(byDate)
  .slice(0, MAX_GROUPS)
  .flatMap(([, tasks]) =>
  tasks.
  filter((task) => !checkedTasks.includes(task.id)).
  slice(0, MAX_TASKS_PER_GROUP)
  );

function TasksWidget() {
  const { groupedTasks, checkedTasks } = useTasks();
  const upcomingTasks = getUpcomingTasks(groupedTasks, checkedTasks);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-lg font-semibold text-slate-900">Upcoming Plans</p>

      <div className="mt-4">
        {upcomingTasks.length > 0 ?
        upcomingTasks.map((task, index) =>
        <div className="border-b border-slate-100 py-4 last:border-b-0" key={task.id}>
              {index !== 0 && <div></div>}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {task.date}
                </p>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{task.name}</p>
                    <p className="text-sm text-slate-600">
                      {task.startTime} - {task.endTime}
                    </p>
                  </div>
                  <Badge variant={PRIORITY_VARIANTS[task.priority]}>
                    {task.priority}
                  </Badge>
                </div>
              </div>
            </div>
        ) :

        <EmptyState
            description="Everything&apos;s all set. There are no upcoming tasks right now."
            title="No tasks ahead"
          />}

      </div>
    </div>
  );
}

export default TasksWidget;
