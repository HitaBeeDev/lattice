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
    <div>
      <p className="text-[0.6rem] font-[500] text-[#a0a6ab] ml-2 mb-[0.3rem]">Tasks</p>
      <div className="bg-[#161c22] h-[2.6rem] rounded-full w-[7.4rem] flex items-center justify-center">
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
    <div>
      <p className="text-[0.6rem] font-[500] text-[#a0a6ab] ml-3 mb-[0.3rem]">Habits</p>
      <div className="bg-[#72e1ee] h-[2.6rem] rounded-full w-[9.5rem] flex items-center justify-center">
        <p className="text-[#edfdfe] text-[0.9rem] font-extralight">
          {completed} of {total} • {pct}%
        </p>
      </div>
    </div>
  );
}

function BigStatItem({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-[3.8rem] leading-none font-[200] text-[#161c22]">{value}</p>
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
    <div className="flex flex-row items-center justify-between mt-2">
      <div className="flex flex-row items-center gap-[0.4rem]">
        <TasksPill completed={completedTodayTasks} total={totalTodayTasks} />
        <HabitsPill completed={completedHabitsToday} total={totalDailyHabits} pct={habitPct} />
        <FocusTimePill focusMinutes={focusMinutes} />
        <WeeklyOutputBar percentage={weeklyGoalAverage} />
      </div>

      <div className="flex flex-row items-center gap-[2.8rem]">
        <BigStatItem value={currentStreak} label="Day Streak" />
        <BigStatItem value={totalHabits} label="Active Habits" />
        <BigStatItem value={completedPomodoros} label="Pomodoros" />
      </div>
    </div>
  );
}

export default StatsBar;
