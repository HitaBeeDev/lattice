import type { Task } from "../../types/task";
import { useTasks } from "../../context/TasksContext";
import { Badge, EmptyState, Skeleton } from "../ui";

const PRIORITY_VARIANTS = {
  High: "high",
  Medium: "medium",
  Low: "low",
} as const;

const MAX_GROUPS = 2;
const MAX_TASKS_PER_GROUP = 2;

const byDate = ([dateA]: [string, Task[]], [dateB]: [string, Task[]]) =>
  new Date(dateA).getTime() - new Date(dateB).getTime();

const getUpcomingTasks = (
  groupedTasks: Record<string, Task[]>,
  checkedTasks: string[]
) =>
  Object.entries(groupedTasks)
    .sort(byDate)
    .slice(0, MAX_GROUPS)
    .flatMap(([, tasks]) =>
      tasks
        .filter((task) => !checkedTasks.includes(task.id))
        .slice(0, MAX_TASKS_PER_GROUP)
    );

function TasksWidgetSkeleton() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <Skeleton className="mb-4 h-5 w-36" />
      <div className="space-y-4">
        {[0, 1].map((i) => (
          <div key={i} className="space-y-2 border-b border-slate-100 pb-4 last:border-b-0">
            <Skeleton className="h-3 w-20" />
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TasksWidget() {
  const { groupedTasks, checkedTasks, isLoading } = useTasks();

  if (isLoading) {
    return <TasksWidgetSkeleton />;
  }

  const upcomingTasks = getUpcomingTasks(groupedTasks, checkedTasks);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-lg font-semibold text-slate-900">Upcoming Plans</p>

      <div className="mt-4">
        {upcomingTasks.length > 0 ? (
          upcomingTasks.map((task, index) => (
            <div
              className="border-b border-slate-100 py-4 last:border-b-0"
              key={task.id}
            >
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
          ))
        ) : (
          <EmptyState
            description="Everything's all set. There are no upcoming tasks right now."
            title="No tasks ahead"
          />
        )}
      </div>
    </div>
  );
}

export default TasksWidget;
