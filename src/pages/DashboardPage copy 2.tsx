import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";
import { mockUser } from "../lib/mockUser";
import {
  AlarmClock,
  ArrowUpRight,
  Check,
  Flame,
  Pause,
  Play,
  Plus,
  RotateCcw,
} from "lucide-react";
import { Link } from "react-router-dom";
import AddModal from "../components/tasks/AddModal";
import { calculateCurrentStreak } from "../components/dashboard/dashboardUtils";
import { useHabits } from "../context/HabitContext";
import { useTasks } from "../context/TasksContext";
import { useTimeTracker } from "../context/TimeTrackerContext";

const TODAY_KEY = new Date().toISOString().slice(0, 10);
const FOCUS_GOAL_MINUTES = 120;
const MAX_DAILY_HABITS = 5;
const MAX_HOME_TASKS = 8;
const PANEL_CLASS =
  "rounded-[2rem] border border-white/80 bg-[rgba(255,255,255,0.68)] p-6 shadow-[0_12px_40px_rgba(6,182,212,0.13)] backdrop-blur-xl";
const DARK_PANEL_CLASS =
  "relative row-span-2 flex min-h-[340px] flex-col justify-between overflow-hidden rounded-[2rem] border border-[rgba(6,182,212,0.18)] bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.14),transparent_38%),linear-gradient(160deg,#0d1f30_0%,#152a3e_100%)] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.32)]";
const MUTED_TEXT_CLASS = "text-[#4a6b82]";
const PRIMARY_TEXT_CLASS = "text-[#0a1929]";
const BORDER_CLASS = "border-[rgba(6,182,212,0.14)]";
const ICON_LINK_CLASS = "text-[#4a6b82] transition-colors hover:text-[#0a1929]";
const OUTLINE_ICON_BUTTON_CLASS =
  "flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(6,182,212,0.14)] bg-white/60 text-[#4a6b82] transition-colors hover:text-[#0a1929]";

function DashboardPage() {
  const { groupedTasks, handleAddButtonClick, showModal } = useTasks();

  const { habits, percentages, weekDates } = useHabits();

  const {
    completedPomodoros,
    todayFocusSeconds,
    dailyFocusSeconds,
    totalSeconds,
    isTimerActive,
    handleStart,
    handlePause,
    handleReset,
    circumference,
    strokeDashoffset,
    radius,
  } = useTimeTracker();

  const today = new Date();
  const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;

  const todayTasks = groupedTasks[TODAY_KEY] ?? [];
  const completedTodayTasks = todayTasks.filter((t) => t.isCompleted).length;
  const totalTodayTasks = todayTasks.length;
  const allTodayTasks = todayTasks.slice(0, MAX_HOME_TASKS);

  const dailyHabits = habits.slice(0, MAX_DAILY_HABITS);
  const completedHabitsToday = dailyHabits.filter((h) =>
    Boolean(h.days[todayIndex]),
  ).length;
  const currentStreak = calculateCurrentStreak(percentages, todayIndex);
  const focusMinutes = Math.round(todayFocusSeconds / 60);
  const focusHours = (focusMinutes / 60).toFixed(1);

  const taskPct =
    totalTodayTasks === 0
      ? 0
      : Math.round((completedTodayTasks / totalTodayTasks) * 100);
  const habitPct =
    dailyHabits.length === 0
      ? 0
      : Math.round((completedHabitsToday / dailyHabits.length) * 100);
  const focusPct = Math.min(
    Math.round((focusMinutes / FOCUS_GOAL_MINUTES) * 100),
    100,
  );

  const chartData = weekDates.map((date, index) => ({
    day: ["S", "M", "T", "W", "T", "F", "S"][date.getDay()],
    habits: percentages[index] ?? 0,
    focus: Math.round(
      (dailyFocusSeconds[date.toISOString().slice(0, 10)] ?? 0) / 60,
    ),
  }));

  const svgSize = (radius + 10) * 2;
  const cx = svgSize / 2;
  const timerMins = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const timerSecs = (totalSeconds % 60).toString().padStart(2, "0");
  const timerDisplay = `${timerMins}:${timerSecs}`;
  const weeklyGoalAverage = Math.round((habitPct + taskPct + focusPct) / 3);

  // #6F757B

  return (
    <main className="h-full overflow-hidden" id="main-content" tabIndex={-1}>
      <div className="min-w-[1280px]">
        {/* Row 1: Welcome Section */}
        <div className="mt-2">
          <p className="font-['Inter'] font-[300] text-[2.1rem] text-[#060a0f]">
            Welcome in, {mockUser.name}
          </p>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-row items-center justify-between mt-6">
          {/* Left Pills */}
          <div className="flex flex-row items-center flex-1 gap-3 pr-12">
            {/* Tasks pill — dark solid */}
            <div className="flex flex-col gap-0.5">
              <span className="text-[0.65rem] font-[500] tracking-wide text-[#4a6b82] uppercase">
                Tasks
              </span>
              <div className="flex h-8 items-center rounded-full bg-[#0a1929] px-3.5 min-w-[62px]">
                <span className="text-[0.8rem] font-[600] text-white">
                  {completedTodayTasks}/{totalTodayTasks} done
                </span>
              </div>
            </div>

            {/* Habits pill — cyan tint */}
            <div className="flex flex-col gap-0.5">
              <span className="text-[0.65rem] font-[500] tracking-wide text-[#4a6b82] uppercase">
                Habits kept today
              </span>
              <div className="flex h-8 items-center rounded-full bg-[rgba(6,182,212,0.18)] px-3.5 min-w-[62px]">
                <span className="text-[0.8rem] font-[600] text-[#0891b2]">
                  {completedHabitsToday}/{dailyHabits.length}
                </span>
              </div>
            </div>

            {/* Focus Time — wide progress track */}
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="text-[0.65rem] font-[500] tracking-wide text-[#4a6b82] uppercase">
                Focus Time
              </span>
              <div className="relative flex h-8 w-full items-center overflow-hidden rounded-full bg-[rgba(6,182,212,0.08)] border border-[rgba(6,182,212,0.14)]">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-[rgba(6,182,212,0.22)] transition-all duration-500"
                  style={{ width: `${focusPct}%` }}
                />
                <span className="relative z-10 pl-3.5 text-[0.8rem] font-[600] text-[#0a1929]">
                  {focusMinutes >= 60
                    ? `${Math.floor(focusMinutes / 60)}h ${focusMinutes % 60}m`
                    : `${focusMinutes}m`}
                </span>
              </div>
            </div>

            {/* Weekly Goal — pill inside track */}
            <div className="flex flex-col gap-0.5">
              <span className="text-[0.65rem] font-[500] tracking-wide text-[#4a6b82] uppercase">
                Weekly Goal
              </span>
              <div
                className="relative flex items-center h-8 overflow-hidden border border-white rounded-full w-44"
                style={{
                  background:
                    "repeating-linear-gradient(-45deg, #e8eef2 0px, #e8eef2 4px, #fff 4px, #fff 8px)",
                }}
              >
                {/* Blue fill = progress portion, on top of hatch */}
                <div
                  className="absolute left-0 top-0 h-full bg-[rgba(6,182,212,0.28)] transition-all duration-500"
                  style={{ width: `${weeklyGoalAverage}%` }}
                />
                <span className="relative z-10 pl-3.5 text-[0.72rem] font-[600] text-[#0a1929]">
                  {weeklyGoalAverage}%
                </span>
              </div>
            </div>
          </div>

          {/* Right Stats */}
          <div className="flex flex-row items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="font-['Inter'] text-[2rem] font-[300] leading-none text-[#0a1929]">
                {currentStreak}
              </span>
              <span className="mt-0.5 text-[0.7rem] font-[500] tracking-wide text-[#4a6b82] uppercase">
                Day Streak
              </span>
            </div>

            <div className="h-8 w-px bg-[rgba(6,182,212,0.2)]" />
            <div className="flex flex-col items-end">
              <span className="font-['Inter'] text-[2rem] font-[300] leading-none text-[#0a1929]">
                {habits.length}
              </span>
              <span className="mt-0.5 text-[0.7rem] font-[500] tracking-wide text-[#4a6b82] uppercase">
                Active Habits
              </span>
            </div>

            <div className="h-8 w-px bg-[rgba(6,182,212,0.2)]" />
            <div className="flex flex-col items-end">
              <span className="font-['Inter'] text-[2rem] font-[300] leading-none text-[#0a1929]">
                {completedPomodoros}
              </span>
              <span className="mt-0.5 text-[0.7rem] font-[500] tracking-wide text-[#4a6b82] uppercase">
                Pomodoros
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DashboardPage;
