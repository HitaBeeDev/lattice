import type { ReactNode } from "react";

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
  suffix?: string;
  note: string;
};

function StatCard({ icon, label, value, suffix, note }: StatCardProps) {
  return (
    <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          {icon}
        </span>
      </div>

      <div className="mb-1 flex items-baseline gap-1">
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        {suffix && <p className="text-sm font-medium text-slate-400">{suffix}</p>}
      </div>

      <p className="text-xs text-slate-400">{note}</p>
    </article>
  );
}

type DashboardStatsProps = {
  completedPomodoros: number;
  completedTasks: number;
  currentStreak: number;
  focusTime: string;
  totalTasks: number;
  taskIcon: ReactNode;
  focusIcon: ReactNode;
  streakIcon: ReactNode;
};

export default function DashboardStats({
  completedPomodoros,
  completedTasks,
  currentStreak,
  focusTime,
  totalTasks,
  taskIcon,
  focusIcon,
  streakIcon,
}: DashboardStatsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-3">
      <StatCard
        icon={taskIcon}
        label="Tasks Completed Today"
        value={completedTasks}
        suffix={`/ ${totalTasks}`}
        note={totalTasks === 0 ? "No tasks scheduled for today" : `${totalTasks - completedTasks} remaining`}
      />
      <StatCard
        icon={focusIcon}
        label="Focus Time Today"
        value={focusTime}
        note={`${completedPomodoros} ${completedPomodoros === 1 ? "pomodoro" : "pomodoros"} completed`}
      />
      <StatCard
        icon={streakIcon}
        label="Current Streak"
        value={`${currentStreak} ${currentStreak === 1 ? "Day" : "Days"}`}
        note={currentStreak > 0 ? "Keep it up!" : "Start your streak today"}
      />
    </section>
  );
}
