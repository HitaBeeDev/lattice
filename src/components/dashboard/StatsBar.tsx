import WeeklyOutputBar from "./WeeklyOutputBar";
import FocusTimePill from "./FocusTimePill";

interface StatsBarProps {
  completedTodayTasks: number;
  totalTodayTasks: number;
  completedHabitsToday: number;
  totalDailyHabits: number;
  habitPct: number;
  focusMinutes: number;
  weeklyGoalAverage: number;
  currentStreak: number;
  totalHabits: number;
  completedPomodoros: number;
}

// ── Sub-components ──────────────────────────────────────────────────────────

function TasksPill({ completed, total }: { completed: number; total: number }) {
  return (
    <div className="w-full sm:w-auto">
      <p className="text-[0.6rem] font-[500] text-[#a0a6ab] ml-2 mb-[0.3rem]">Tasks</p>
      <div className="flex h-[2.6rem] w-full items-center justify-center rounded-full bg-[#161c22] sm:w-[7.4rem]">
        <p className="text-[#f9fafb] text-[0.9rem] font-extralight">
          {completed}/{total} done
        </p>
      </div>
    </div>
  );
}

function HabitsPill({
  completed,
  total,
  pct,
}: {
  completed: number;
  total: number;
  pct: number;
}) {
  return (
    <div className="w-full sm:w-auto">
      <p className="text-[0.6rem] font-[500] text-[#a0a6ab] ml-3 mb-[0.3rem]">Habits</p>
      <div className="flex h-[2.6rem] w-full items-center justify-center rounded-full bg-[#72e1ee] sm:w-[9.5rem]">
        <p className="text-[#edfdfe] text-[0.9rem] font-extralight">
          {completed} of {total} • {pct}%
        </p>
      </div>
    </div>
  );
}

function BigStatItem({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-[1.2rem] bg-[#cee2e9]/30 px-3 py-4 xl:flex-none xl:rounded-none xl:bg-transparent xl:px-0 xl:py-0">
      <p className="text-[2.2rem] leading-none font-[200] text-[#161c22] sm:text-[2.8rem] xl:text-[3.8rem]">{value}</p>
      <p className="text-[0.6rem] leading-none font-[500] text-[#a0a6ab] mt-[0.3rem]">{label}</p>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

function StatsBar({
  completedTodayTasks,
  totalTodayTasks,
  completedHabitsToday,
  totalDailyHabits,
  habitPct,
  focusMinutes,
  weeklyGoalAverage,
  currentStreak,
  totalHabits,
  completedPomodoros,
}: StatsBarProps) {
  return (
    <div className="mt-2 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-row sm:flex-wrap sm:items-center sm:gap-[0.4rem] md:flex-nowrap">
        <TasksPill completed={completedTodayTasks} total={totalTodayTasks} />
        <HabitsPill completed={completedHabitsToday} total={totalDailyHabits} pct={habitPct} />
        <FocusTimePill focusMinutes={focusMinutes} />
        <WeeklyOutputBar percentage={weeklyGoalAverage} />
      </div>

      <div className="grid grid-cols-3 gap-3 xl:flex xl:flex-row xl:flex-wrap xl:items-center xl:gap-[2.8rem]">
        <BigStatItem value={currentStreak} label="Day Streak" />
        <BigStatItem value={totalHabits} label="Active Habits" />
        <BigStatItem value={completedPomodoros} label="Pomodoros" />
      </div>
    </div>
  );
}

export default StatsBar;
