import type { ReactNode } from "react";

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
  suffix?: string;
  note?: string;
};

function StatCard({ icon, label, value, suffix, note }: StatCardProps) {
  return (
    <article className="app-card relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-[var(--app-accent-soft)] blur-2xl"
      />
      <div className="relative mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">{label}</p>
          <div className="mt-4 flex items-baseline gap-2">
            <p className="text-4xl font-semibold tracking-[-0.05em] text-slate-950">{value}</p>
            {suffix && <p className="text-sm font-medium text-slate-600">{suffix}</p>}
          </div>
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-[var(--app-accent)] shadow-lg">
          {icon}
        </span>
      </div>
      {note ? <p className="relative text-sm text-slate-600">{note}</p> : null}
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
        label="Tasks"
        value={completedTasks}
        suffix={`/ ${totalTasks}`}
        note={totalTasks === 0 ? "Nothing scheduled" : `${totalTasks - completedTasks} left`}
      />
      <StatCard
        icon={focusIcon}
        label="Focus"
        value={focusTime}
        note={`${completedPomodoros} ${completedPomodoros === 1 ? "session" : "sessions"}`}
      />
      <StatCard
        icon={streakIcon}
        label="Streak"
        value={`${currentStreak} ${currentStreak === 1 ? "Day" : "Days"}`}
        note={currentStreak > 0 ? "Active" : "Start today"}
      />
    </section>
  );
}
