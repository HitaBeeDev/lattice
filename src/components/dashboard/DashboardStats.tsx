import type { ReactNode } from "react";

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
  suffix?: string;
  note: string;
  notePrefix: string;
};

function StatCard({ icon, label, value, suffix, note, notePrefix }: StatCardProps) {
  return (
    <article>
      <div>
        <p>{label}</p>
        <span>{icon}</span>
      </div>

      <div>
        <p>{value}</p>
        {suffix && <p>{suffix}</p>}
      </div>

      <p>
        {notePrefix}
        {note}
      </p>
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
    <section>
      <StatCard
        icon={taskIcon}
        label="Tasks Completed"
        value={completedTasks}
        suffix={totalTasks > 0 ? `/ ${totalTasks}` : "/ 0"}
        note="+2 from yesterday"
        notePrefix="+ "
      />
      <StatCard
        icon={focusIcon}
        label="Focus Time"
        value={focusTime}
        note={`${completedPomodoros} pomodoros completed`}
        notePrefix="+ "
      />
      <StatCard
        icon={streakIcon}
        label="Current Streak"
        value={`${currentStreak} ${currentStreak === 1 ? "Day" : "Days"}`}
        note="Personal best this month!"
        notePrefix="+ "
      />
    </section>
  );
}
