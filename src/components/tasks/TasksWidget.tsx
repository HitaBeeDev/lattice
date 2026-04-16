import { useMemo } from "react";
import { useTasks } from "../../context/TasksContext";
import { Badge, EmptyState, Skeleton } from "../ui";
import { getUpcomingTasks, TASK_WIDGET_SKELETON_IDS } from "../../lib/taskWidget";
const PRIORITY_VARIANTS = {
    High: "high",
    Medium: "medium",
    Low: "low",
} as const;
function TasksWidgetSkeleton() {
    return (<div>
      <Skeleton className="h-6 w-28" />
      <div>
        {TASK_WIDGET_SKELETON_IDS.map((id) => (<div key={id}>
            <Skeleton className="mt-3 h-5 w-20" />
            <div>
              <div>
                <Skeleton className="mt-2 h-4 w-36" />
                <Skeleton className="mt-2 h-4 w-24" />
              </div>
              <Skeleton className="mt-2 h-5 w-16 rounded-full" />
            </div>
          </div>))}
      </div>
    </div>);
}
function TasksWidget() {
    const { groupedTasks, checkedTasks, isLoading } = useTasks();
    const upcomingTasks = useMemo(() => getUpcomingTasks(groupedTasks, checkedTasks), [
        checkedTasks,
        groupedTasks
    ]);
    if (isLoading) {
        return <TasksWidgetSkeleton />;
    }
    return (<div>
      <div>
        <p>
          Delivery queue
        </p>
        <p>
          Upcoming plans
        </p>
      </div>

      <div>
        {upcomingTasks.length > 0 ? (upcomingTasks.map((task, index) => (<div key={task.id}>
              {index !== 0 && <div></div>}
              <div>
                <p>
                  {task.date}
                </p>
                <div>
                  <div>
                    <p>{task.name}</p>
                    <p>
                      {task.startTime} - {task.endTime}
                    </p>
                  </div>
                  <Badge variant={PRIORITY_VARIANTS[task.priority]}>
                    {task.priority}
                  </Badge>
                </div>
              </div>
            </div>))) : (<EmptyState description="Everything's all set. There are no upcoming tasks right now." title="No tasks ahead"/>)}
      </div>
    </div>);
}
export default TasksWidget;
