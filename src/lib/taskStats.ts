import type { Task } from "../types/task";

export type TaskCardStat = {
  completedCount: number;
  inProgressCount: number;
  remainingCount: number;
  progress: number;
  inProgressPct: number;
  remainingPct: number;
};

export function computeTaskCardStats(visibleTasks: Task[]): TaskCardStat {
  const completedCount = visibleTasks.filter((t) => t.isCompleted).length;
  const inProgressCount = visibleTasks.filter(
    (t) => t.status === "in_progress" && !t.isCompleted,
  ).length;
  const remainingCount = Math.max(visibleTasks.length - completedCount - inProgressCount, 0);
  const pct = (n: number) =>
    visibleTasks.length === 0 ? 0 : Math.round((n / visibleTasks.length) * 100);
  return {
    completedCount,
    inProgressCount,
    remainingCount,
    progress: pct(completedCount),
    inProgressPct: pct(inProgressCount),
    remainingPct: pct(remainingCount),
  };
}
