import type { Task } from "../types/task";

const MAX_GROUPS = 2;
const MAX_TASKS_PER_GROUP = 2;

const byDate = ([dateA]: [string, Task[]], [dateB]: [string, Task[]]) =>
  new Date(dateA).getTime() - new Date(dateB).getTime();

export const TASK_WIDGET_SKELETON_IDS = ["queue-primary", "queue-secondary"] as const;

/**
 * Returns the next unchecked tasks to show in the compact task widget.
 */
export function getUpcomingTasks(
  groupedTasks: Record<string, Task[]>,
  checkedTaskIds: string[],
): Task[] {
  return Object.entries(groupedTasks)
    .sort(byDate)
    .slice(0, MAX_GROUPS)
    .flatMap(([, tasks]) =>
      tasks
        .filter((task) => !checkedTaskIds.includes(task.id))
        .slice(0, MAX_TASKS_PER_GROUP),
    );
}
