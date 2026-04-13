import type { ReactNode } from "react";
type StatCardProps = {
    icon: ReactNode;
    label: string;
    value: string | number;
    suffix?: string;
    note?: string;
};
function StatCard({ icon, label, value, suffix, note }: StatCardProps) {
    return (<article>
      <div aria-hidden="true"/>
      <div>
        <div>
          <p>{label}</p>
          <div>
            <p>{value}</p>
            {suffix && <p>{suffix}</p>}
          </div>
        </div>
        <span>
          {icon}
        </span>
      </div>
      {note ? <p>{note}</p> : null}
    </article>);
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
export default function DashboardStats({ completedPomodoros, completedTasks, currentStreak, focusTime, totalTasks, taskIcon, focusIcon, streakIcon, }: DashboardStatsProps) {
    return (<section>
      <StatCard icon={taskIcon} label="Tasks" value={completedTasks} suffix={`/ ${totalTasks}`} note={totalTasks === 0 ? "Nothing scheduled" : `${totalTasks - completedTasks} left`}/>
      <StatCard icon={focusIcon} label="Focus" value={focusTime} note={`${completedPomodoros} ${completedPomodoros === 1 ? "session" : "sessions"}`}/>
      <StatCard icon={streakIcon} label="Streak" value={`${currentStreak} ${currentStreak === 1 ? "Day" : "Days"}`} note={currentStreak > 0 ? "Active" : "Start today"}/>
    </section>);
}
