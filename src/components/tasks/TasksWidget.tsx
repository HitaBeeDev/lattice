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
const byDate = ([dateA]: [
    string,
    Task[]
], [dateB]: [
    string,
    Task[]
]) => new Date(dateA).getTime() - new Date(dateB).getTime();
const getUpcomingTasks = (groupedTasks: Record<string, Task[]>, checkedTasks: string[]) => Object.entries(groupedTasks)
    .sort(byDate)
    .slice(0, MAX_GROUPS)
    .flatMap(([, tasks]) => tasks
    .filter((task) => !checkedTasks.includes(task.id))
    .slice(0, MAX_TASKS_PER_GROUP));
function TasksWidgetSkeleton() {
    return (<div>
      <Skeleton />
      <div>
        {[0, 1].map((i) => (<div key={`skeleton-task-${i}`}>
            <Skeleton />
            <div>
              <div>
                <Skeleton />
                <Skeleton />
              </div>
              <Skeleton />
            </div>
          </div>))}
      </div>
    </div>);
}
function TasksWidget() {
    const { groupedTasks, checkedTasks, isLoading } = useTasks();
    if (isLoading) {
        return <TasksWidgetSkeleton />;
    }
    const upcomingTasks = getUpcomingTasks(groupedTasks, checkedTasks);
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
