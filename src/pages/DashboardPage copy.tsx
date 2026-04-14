import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";
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

  return (
    <main className="h-full overflow-hidden" id="main-content" tabIndex={-1}>
      <div className="min-w-[1280px] space-y-4">
        {/* ── Row 1: Welcome + Stats ───────────────────────────────────────── */}
        <div className="flex items-start justify-between">
          {/* Left: welcome + stat pills */}
          <div>
            <h1
              className={`text-[2.6rem] font-bold leading-none tracking-tight ${PRIMARY_TEXT_CLASS}`}
            >
              Welcome in, Alex
            </h1>

            <div className="flex flex-wrap items-center gap-5 mt-6">
              {/* Habits pill — dark */}
              <div className="flex items-center gap-2">
                <span className={`text-sm ${MUTED_TEXT_CLASS}`}>Habits</span>
                <span className="rounded-full bg-[#0a1929] px-3 py-1 text-xs font-semibold text-white">
                  {habitPct}%
                </span>
              </div>

              {/* Tasks pill — cyan */}
              <div className="flex items-center gap-2">
                <span className={`text-sm ${MUTED_TEXT_CLASS}`}>Tasks</span>
                <span className="rounded-full bg-[#06b6d4] px-3 py-1 text-xs font-semibold text-white">
                  {taskPct}%
                </span>
              </div>

              {/* Focus — inline bar */}
              <div className="flex items-center gap-2">
                <span className={`text-sm ${MUTED_TEXT_CLASS}`}>Focus</span>
                <div className="relative h-2 overflow-hidden rounded-full w-28 bg-white/60">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-[#cbd5e1]"
                    style={{ width: `${focusPct}%` }}
                  />
                </div>
                <span
                  className={`rounded-full border ${BORDER_CLASS} bg-white/60 px-3 py-1 text-xs font-semibold ${PRIMARY_TEXT_CLASS}`}
                >
                  {focusMinutes}m
                </span>
              </div>

              {/* Streak pill */}
              <div className="flex items-center gap-2">
                <span className={`text-sm ${MUTED_TEXT_CLASS}`}>Streak</span>
                <span
                  className={`rounded-full border ${BORDER_CLASS} bg-white/60 px-3 py-1 text-xs font-semibold ${PRIMARY_TEXT_CLASS}`}
                >
                  {currentStreak}d
                </span>
              </div>
            </div>
          </div>

          {/* Right: big numbers */}
          <div className="flex items-start gap-8 pr-1">
            <div className="text-right">
              <p
                className={`text-5xl font-bold leading-none tracking-tighter ${PRIMARY_TEXT_CLASS}`}
              >
                {habits.length}
              </p>
              <p
                className={`mt-1 text-[10px] uppercase tracking-widest ${MUTED_TEXT_CLASS}`}
              >
                Habits
              </p>
            </div>
            <div className="text-right">
              <p
                className={`text-5xl font-bold leading-none tracking-tighter ${PRIMARY_TEXT_CLASS}`}
              >
                {completedTodayTasks}
              </p>
              <p
                className={`mt-1 text-[10px] uppercase tracking-widest ${MUTED_TEXT_CLASS}`}
              >
                Done
              </p>
            </div>
            <div className="text-right">
              <p
                className={`text-5xl font-bold leading-none tracking-tighter ${PRIMARY_TEXT_CLASS}`}
              >
                {completedPomodoros}
              </p>
              <p
                className={`mt-1 text-[10px] uppercase tracking-widest ${MUTED_TEXT_CLASS}`}
              >
                Sessions
              </p>
            </div>
          </div>
        </div>

        {/* ── Row 2: 4-card bento grid ─────────────────────────────────────── */}
        {/*
          Layout:
          col 1          col 2       col 3     col 4
          [Profile ↕2]  [Progress]  [Timer]   [Goals ↕2]
          [Profile ↕2]  [Calendar ←→ 2 cols]  [Goals ↕2]
      */}
        <div className="grid grid-cols-4 grid-rows-[auto_auto] gap-4">
          {/* ── Card 1: Profile (tall, row-span-2) ── */}
          <div className={DARK_PANEL_CLASS}>
            {/* decorative blobs */}
            <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#06b6d4]/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-[#06b6d4]/10 blur-2xl" />

            {/* Avatar */}
            <div className="relative z-10">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#06b6d4] to-[#0891b2] text-2xl font-bold text-white">
                A
              </div>
            </div>

            {/* Bottom info */}
            <div className="relative z-10">
              <p className="text-lg font-bold text-white">Alex</p>
              <p className="mt-0.5 text-xs text-white/50">
                Productivity Dashboard
              </p>

              <div className="flex flex-col gap-2 mt-3">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
                  <Flame
                    aria-hidden="true"
                    className="w-3 h-3 text-orange-400"
                  />
                  {currentStreak} day streak
                </span>

                <div className="px-3 py-2 border rounded-xl border-white/10 bg-white/5">
                  <p className="text-[10px] uppercase tracking-widest text-white/40">
                    Focus today
                  </p>
                  <p className="mt-0.5 text-xl font-bold text-white">
                    {focusHours}
                    <span className="ml-1 text-sm font-normal text-white/50">
                      h
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Card 2: Activity chart ── */}
          <div className={`${PANEL_CLASS} flex min-h-[160px] flex-col`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p
                  className={`text-[10px] uppercase tracking-widest ${MUTED_TEXT_CLASS}`}
                >
                  Progress
                </p>
                <p
                  className={`mt-0.5 text-2xl font-bold ${PRIMARY_TEXT_CLASS}`}
                >
                  {focusHours}
                  <span
                    className={`ml-1 text-sm font-normal ${MUTED_TEXT_CLASS}`}
                  >
                    h
                  </span>
                </p>
              </div>
              <Link
                aria-label="View habit tracker"
                className={ICON_LINK_CLASS}
                to="/habit-tracker"
              >
                <ArrowUpRight aria-hidden="true" className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex-1">
              <ResponsiveContainer height={100} width="100%">
                <BarChart barCategoryGap="20%" barGap={2} data={chartData}>
                  <XAxis
                    axisLine={false}
                    dataKey="day"
                    tick={{ fill: "#8ab4c8", fontSize: 10 }}
                    tickLine={false}
                  />
                  <Bar
                    dataKey="habits"
                    fill="#0a1929"
                    name="Habits"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="focus"
                    fill="#06b6d4"
                    name="Focus"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Card 3: Pomodoro timer ── */}
          <div
            className={`${PANEL_CLASS} flex min-h-[160px] flex-col items-center justify-between`}
          >
            <div className="flex items-center justify-between w-full">
              <p
                className={`text-[10px] uppercase tracking-widest ${MUTED_TEXT_CLASS}`}
              >
                Time tracker
              </p>
              <Link
                aria-label="Open Pomodoro page"
                className={ICON_LINK_CLASS}
                to="/pomodoro"
              >
                <ArrowUpRight aria-hidden="true" className="w-4 h-4" />
              </Link>
            </div>

            {/* Circular timer */}
            <div className="relative flex items-center justify-center">
              <svg
                aria-hidden="true"
                height={svgSize}
                viewBox={`0 0 ${svgSize} ${svgSize}`}
                width={svgSize}
              >
                <circle
                  cx={cx}
                  cy={cx}
                  fill="none"
                  r={radius}
                  stroke="rgba(6,182,212,0.12)"
                  strokeWidth={10}
                />
                <circle
                  cx={cx}
                  cy={cx}
                  fill="none"
                  r={radius}
                  stroke="#06b6d4"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  strokeWidth={10}
                  transform={`rotate(-90 ${cx} ${cx})`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p
                  className={`text-2xl font-bold leading-none tracking-tight ${PRIMARY_TEXT_CLASS}`}
                >
                  {timerDisplay}
                </p>
                <p className={`mt-0.5 text-[10px] ${MUTED_TEXT_CLASS}`}>
                  Work time
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                aria-label={isTimerActive ? "Pause timer" : "Start timer"}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#06b6d4] text-white transition-colors hover:bg-[#06b6d4]/80"
                onClick={isTimerActive ? handlePause : handleStart}
                type="button"
              >
                {isTimerActive ? (
                  <Pause aria-hidden="true" className="w-4 h-4" />
                ) : (
                  <Play aria-hidden="true" className="w-4 h-4" />
                )}
              </button>
              <button
                aria-label="Reset timer"
                className={OUTLINE_ICON_BUTTON_CLASS}
                onClick={handleReset}
                type="button"
              >
                <RotateCcw aria-hidden="true" className="w-4 h-4" />
              </button>
              <Link
                aria-label="Open full timer"
                className={OUTLINE_ICON_BUTTON_CLASS}
                to="/pomodoro"
              >
                <AlarmClock aria-hidden="true" className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* ── Card 4: Goals (tall, row-span-2) ── */}
          <div className={`${PANEL_CLASS} row-span-2 flex flex-col`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p
                  className={`text-[10px] uppercase tracking-widest ${MUTED_TEXT_CLASS}`}
                >
                  Weekly Goals
                </p>
                <p
                  className={`mt-0.5 text-2xl font-bold ${PRIMARY_TEXT_CLASS}`}
                >
                  {weeklyGoalAverage}%
                </p>
              </div>
              <Link
                aria-label="View all habits"
                className={ICON_LINK_CLASS}
                to="/habit-tracker"
              >
                <ArrowUpRight aria-hidden="true" className="w-4 h-4" />
              </Link>
            </div>

            {/* Progress bars */}
            <div className="space-y-3">
              {[
                { label: "Habits", value: habitPct, color: "bg-[#06b6d4]" },
                { label: "Tasks", value: taskPct, color: "bg-[#0a1929]" },
                { label: "Focus", value: focusPct, color: "bg-[#94a3b8]" },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div className="flex justify-between mb-1 text-xs">
                    <span className={MUTED_TEXT_CLASS}>{label}</span>
                    <span className={`font-semibold ${PRIMARY_TEXT_CLASS}`}>
                      {value}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#06b6d4]/10">
                    <div
                      className={`h-full rounded-full transition-all ${color}`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Dark mini-card: task summary */}
            <div className="mt-4 rounded-2xl bg-[#0a1929] p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] uppercase tracking-widest text-white/40">
                  Today
                </p>
                <span className="rounded-full bg-[#06b6d4]/20 px-2.5 py-0.5 text-sm font-bold text-white">
                  {completedTodayTasks}/{totalTodayTasks}
                </span>
              </div>

              <div className="space-y-2 max-h-[160px] overflow-y-auto">
                {allTodayTasks.length === 0 ? (
                  <p className="text-xs text-white/30">Nothing scheduled</p>
                ) : (
                  allTodayTasks.slice(0, 6).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/5 px-3 py-2"
                    >
                      <span
                        className={`h-2 w-2 flex-shrink-0 rounded-full ${
                          task.isCompleted ? "bg-[#06b6d4]" : "bg-white/20"
                        }`}
                      />
                      <p
                        className={`flex-1 truncate text-xs font-medium ${
                          task.isCompleted
                            ? "line-through text-white/30"
                            : "text-white/85"
                        }`}
                      >
                        {task.name}
                      </p>
                      {task.isCompleted && (
                        <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#06b6d4]">
                          <Check
                            aria-hidden="true"
                            className="h-2.5 w-2.5 text-white"
                          />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <Link
                className="mt-3 block text-center text-[11px] font-semibold text-[#06b6d4] transition-colors hover:text-white"
                to="/tasks"
              >
                View all tasks →
              </Link>
            </div>
          </div>

          {/* ── Card 5: Calendar / Today's schedule (cols 2-3) ── */}
          <div className={`${PANEL_CLASS} col-span-2`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p
                  className={`text-[10px] uppercase tracking-widest ${MUTED_TEXT_CLASS}`}
                >
                  Schedule
                </p>
                <h2
                  className={`mt-0.5 text-base font-bold ${PRIMARY_TEXT_CLASS}`}
                >
                  {today.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </h2>
              </div>
              <button
                className="flex items-center gap-1.5 rounded-full bg-[#0a1929] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#152a3e]"
                onClick={handleAddButtonClick}
                type="button"
              >
                <Plus aria-hidden="true" className="w-3 h-3" />
                Add Task
              </button>
            </div>

            {allTodayTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#06b6d4]/10">
                  <Check
                    aria-hidden="true"
                    className="h-5 w-5 text-[#06b6d4]"
                  />
                </div>
                <p className={`text-sm ${MUTED_TEXT_CLASS}`}>
                  All clear for today
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {allTodayTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 rounded-xl border ${BORDER_CLASS} bg-white/60 px-4 py-3`}
                  >
                    <span
                      className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${
                        task.isCompleted ? "bg-[#06b6d4]" : "bg-[#0a1929]"
                      }`}
                    />
                    <div className="flex flex-col flex-1 min-w-0">
                      <p
                        className={`truncate text-sm font-medium ${
                          task.isCompleted
                            ? `line-through ${MUTED_TEXT_CLASS}`
                            : PRIMARY_TEXT_CLASS
                        }`}
                      >
                        {task.name}
                      </p>
                      {(task.startTime || task.endTime) && (
                        <p className={`mt-0.5 text-xs ${MUTED_TEXT_CLASS}`}>
                          {task.startTime}
                          {task.startTime && task.endTime ? " – " : ""}
                          {task.endTime}
                        </p>
                      )}
                    </div>
                    {task.isCompleted && (
                      <Check
                        aria-hidden="true"
                        className="h-4 w-4 flex-shrink-0 text-[#06b6d4]"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/*
            Row 3: Daily habit check-in card
            Removed for now to keep the homepage within the viewport without a scrollbar.

          <div className={PANEL_CLASS}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className={`text-[10px] uppercase tracking-widest ${MUTED_TEXT_CLASS}`}>
                  Daily
                </p>
                <h2 className={`mt-0.5 text-base font-bold ${PRIMARY_TEXT_CLASS}`}>
                  Habit Check-in
                </h2>
              </div>
              <Link
                className="text-xs font-semibold text-[#06b6d4] transition-colors hover:text-[#0a1929]"
                to="/habit-tracker"
              >
                All habits →
              </Link>
            </div>

            {dailyHabits.length === 0 ? (
              <div className="flex items-center justify-center h-20">
                <p className={`text-sm ${MUTED_TEXT_CLASS}`}>
                  No habits yet —{" "}
                  <Link className="text-[#06b6d4]" to="/habit-tracker">
                    add some
                  </Link>
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-6 divide-y divide-[rgba(6,182,212,0.14)]/40 lg:grid-cols-3 xl:grid-cols-5">
                {dailyHabits.map((habit, index) => {
                  const isExpanded = expandedHabitId === habit.id;
                  const streakCount = habit.days.filter(Boolean).length;
                  const isDoneToday = Boolean(habit.days[todayIndex]);

                  return (
                    <div key={habit.id} className="col-span-1">
                      <button
                        className="flex items-center justify-between w-full py-3 text-left"
                        onClick={() =>
                          setExpandedHabitId(isExpanded ? null : habit.id)
                        }
                        type="button"
                      >
                        <div className="flex items-center min-w-0 gap-2">
                          <span
                            className={`h-2 w-2 flex-shrink-0 rounded-full ${
                              isDoneToday ? "bg-[#06b6d4]" : "bg-[rgba(6,182,212,0.14)]"
                            }`}
                          />
                          <span className={`truncate text-sm font-medium ${PRIMARY_TEXT_CLASS}`}>
                            {habit.name}
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp
                            aria-hidden="true"
                            className={`ml-2 h-3.5 w-3.5 flex-shrink-0 ${MUTED_TEXT_CLASS}`}
                          />
                        ) : (
                          <ChevronDown
                            aria-hidden="true"
                            className={`ml-2 h-3.5 w-3.5 flex-shrink-0 ${MUTED_TEXT_CLASS}`}
                          />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="pb-3 pl-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex gap-0.5">
                              {habit.days.map((done, di) => (
                                <span
                                  key={di}
                                  className={`h-2 w-2 rounded-full ${
                                    done ? "bg-[#06b6d4]" : "bg-[rgba(6,182,212,0.14)]"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className={`flex items-center gap-1 text-xs ${MUTED_TEXT_CLASS}`}>
                              <Flame
                                aria-hidden="true"
                                className="w-3 h-3 text-orange-400"
                              />
                              {streakCount}d
                            </span>
                          </div>
                          <button
                            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                              isDoneToday
                                ? "bg-[#06b6d4]/10 text-[#06b6d4]"
                                : "bg-[#0a1929] text-white"
                            }`}
                            onClick={() => toggleDayMark(index, todayIndex)}
                            type="button"
                          >
                            {isDoneToday ? "✓ Done today" : "Mark today"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          */}

        {showModal && <AddModal />}
      </div>
    </main>
  );
}

export default DashboardPage;
