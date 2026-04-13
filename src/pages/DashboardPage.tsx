import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowRight, Check, Flame, Plus, TimerReset } from "lucide-react";
import { Link } from "react-router-dom";
import AddModal from "../components/tasks/AddModal";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardStats from "../components/dashboard/DashboardStats";
import { CheckIcon, ClockIcon, FlameIcon } from "../components/dashboard/dashboardIcons";
import {
  calculateCurrentStreak,
  formatDuration,
  getGreeting,
} from "../components/dashboard/dashboardUtils";
import { Button, Skeleton } from "../components/ui";
import { useHabits } from "../context/HabitContext";
import { useTasks } from "../context/TasksContext";
import { useTimeTracker } from "../context/TimeTrackerContext";
import type { Task } from "../types/task";

const MAX_DAILY_HABITS = 5;
const MAX_HOME_TASKS = 4;
const FOCUS_GOAL_MINUTES = 120;
const TODAY_KEY = new Date().toISOString().slice(0, 10);

const PRIORITY_STYLES = {
  High: "bg-rose-500",
  Medium: "bg-amber-400",
  Low: "bg-emerald-500",
} as const;

function StatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="h-36 rounded-[2rem]" />
      ))}
    </div>
  );
}

function CircleProgress({
  label,
  value,
  sublabel,
  progress,
}: {
  label: string;
  value: string;
  sublabel: string;
  progress: number;
}) {
  const size = 188;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - Math.max(0, Math.min(1, progress)));

  return (
    <div className="relative mx-auto flex h-[188px] w-[188px] items-center justify-center">
      <svg
        aria-hidden="true"
        className="-rotate-90"
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        width={size}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke="var(--app-accent)"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">{label}</p>
        <p className="mt-2 text-4xl font-semibold tracking-[-0.06em] text-white">{value}</p>
        <p className="mt-1 text-sm text-white/75">{sublabel}</p>
      </div>
    </div>
  );
}

function MiniTaskCard({ task }: { task: Task }) {
  return (
    <div className="rounded-[1.5rem] border border-black/5 bg-white/55 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-slate-950">{task.name}</p>
          <p className="mt-1 text-sm text-slate-600">
            {task.startTime} - {task.endTime}
          </p>
        </div>
        <span
          aria-hidden="true"
          className={`mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full ${PRIORITY_STYLES[task.priority]}`}
        />
      </div>
    </div>
  );
}

function QuickActions({ onAddTask }: { onAddTask: () => void }) {
  const actionClassName =
    "flex items-center justify-between rounded-[1.35rem] border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/85 transition hover:bg-white/10";

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Button className="justify-between rounded-[1.35rem] bg-[var(--app-accent)] text-slate-950" onClick={onAddTask}>
        <span className="inline-flex items-center gap-2">
          <Plus aria-hidden="true" className="h-4 w-4" />
          Task
        </span>
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Button>
      <Link className={actionClassName} to="/pomodoro">
        <span className="inline-flex items-center gap-2">
          <TimerReset aria-hidden="true" className="h-4 w-4" />
          Focus
        </span>
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Link>
      <Link className={actionClassName} to="/habit-tracker">
        <span className="inline-flex items-center gap-2">
          <Flame aria-hidden="true" className="h-4 w-4" />
          Habit
        </span>
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Link>
    </div>
  );
}

function DashboardPage() {
  const {
    groupedTasks,
    handleAddButtonClick,
    showModal,
    isLoading: isTasksLoading,
  } = useTasks();
  const {
    habits,
    toggleDayMark,
    percentages,
    weekDates,
    isLoading: isHabitsLoading,
  } = useHabits();
  const { completedPomodoros, todayFocusSeconds, dailyFocusSeconds } =
    useTimeTracker();

  const today = new Date();
  const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const greeting = getGreeting(today);
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  const todayTasks = groupedTasks[TODAY_KEY] ?? [];
  const completedTodayTasks = todayTasks.filter((t) => t.isCompleted).length;
  const totalTodayTasks = todayTasks.length;
  const openTodayTasks = todayTasks.filter((task) => !task.isCompleted).slice(0, MAX_HOME_TASKS);

  const focusTime = formatDuration(todayFocusSeconds);
  const currentStreak = calculateCurrentStreak(percentages);
  const dailyHabits = habits.slice(0, MAX_DAILY_HABITS);
  const completedHabitsToday = dailyHabits.filter((habit) => Boolean(habit.days[todayIndex])).length;

  const isStatsLoading = isTasksLoading || isHabitsLoading;

  const chartData = weekDates.map((date, index) => {
    const dateKey = date.toISOString().slice(0, 10);
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      habits: percentages[index] ?? 0,
      focus: Math.round((dailyFocusSeconds[dateKey] ?? 0) / 60),
    };
  });

  const taskProgress = totalTodayTasks === 0 ? 0 : completedTodayTasks / totalTodayTasks;
  const habitProgress = dailyHabits.length === 0 ? 0 : completedHabitsToday / dailyHabits.length;
  const focusMinutes = Math.round(todayFocusSeconds / 60);
  const focusProgress = Math.min(focusMinutes / FOCUS_GOAL_MINUTES, 1);
  const overallProgress = (taskProgress + habitProgress + focusProgress) / 3;

  return (
    <main className="space-y-8 p-5 sm:p-6 lg:p-8" id="main-content" tabIndex={-1}>
      <DashboardHeader
        formattedDate={formattedDate}
        greeting={greeting}
        onAddTask={handleAddButtonClick}
      />

      <section className="app-panel-dark relative overflow-hidden p-6 sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(217,242,71,0.24),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_24%)]"
        />

        <div className="relative grid gap-8 xl:grid-cols-[16rem_minmax(0,1fr)]">
          <CircleProgress
            label="Today"
            progress={overallProgress}
            sublabel={`${Math.round(overallProgress * 100)}%`}
            value={`${completedTodayTasks + completedHabitsToday + completedPomodoros}`}
          />

          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.6rem] border border-white/10 bg-white/6 p-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/50">Tasks</p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {completedTodayTasks}
                  <span className="ml-1 text-lg text-white/55">/ {totalTodayTasks}</span>
                </p>
              </div>
              <div className="rounded-[1.6rem] border border-white/10 bg-white/6 p-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/50">Habits</p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {completedHabitsToday}
                  <span className="ml-1 text-lg text-white/55">/ {dailyHabits.length}</span>
                </p>
              </div>
              <div className="rounded-[1.6rem] border border-black/5 bg-[var(--app-accent)]/90 p-4 text-slate-950">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-700">Focus</p>
                <p className="mt-3 text-3xl font-semibold">{focusMinutes}</p>
                <p className="mt-1 text-sm text-slate-700">min</p>
              </div>
            </div>

            <QuickActions onAddTask={handleAddButtonClick} />
          </div>
        </div>
      </section>

      {isStatsLoading ? (
        <StatsSkeleton />
      ) : (
        <DashboardStats
          completedPomodoros={completedPomodoros}
          completedTasks={completedTodayTasks}
          currentStreak={currentStreak}
          focusIcon={<ClockIcon />}
          focusTime={focusTime}
          streakIcon={<FlameIcon />}
          taskIcon={<CheckIcon />}
          totalTasks={totalTodayTasks}
        />
      )}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <article className="app-card">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">Queue</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Today
              </h2>
            </div>
            <Link className="text-sm font-medium text-slate-600 transition hover:text-slate-950" to="/tasks">
              All
            </Link>
          </div>

          {openTodayTasks.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {openTodayTasks.map((task) => (
                <MiniTaskCard key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.6rem] border border-dashed border-black/10 bg-white/40 px-6 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-[var(--app-accent)]">
                <Check aria-hidden="true" className="h-5 w-5" />
              </div>
              <p className="mt-4 text-sm font-medium text-slate-700">Clear</p>
            </div>
          )}
        </article>

        <article className="app-card">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">Habits</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Check-in
              </h2>
            </div>
            <Link className="text-sm font-medium text-slate-600 transition hover:text-slate-950" to="/habit-tracker">
              All
            </Link>
          </div>

          <div className="space-y-3">
            {dailyHabits.length > 0 ? (
              dailyHabits.map((habit, index) => {
                const streakCount = habit.days.filter(Boolean).length;
                const isDone = Boolean(habit.days[todayIndex]);

                return (
                  <button
                    key={habit.id}
                    className="flex w-full items-center justify-between rounded-[1.35rem] border border-black/5 bg-white/55 px-4 py-3 text-left transition hover:border-black/10 hover:bg-white"
                    onClick={() => toggleDayMark(index, todayIndex)}
                    type="button"
                  >
                    <div className="min-w-0">
                      <p className={`truncate text-sm font-semibold ${isDone ? "text-slate-500 line-through" : "text-slate-900"}`}>
                        {habit.name}
                      </p>
                      <div className="mt-2 flex gap-1.5">
                        {habit.days.map((day, dayIndex) => (
                          <span
                            key={`${habit.id}-${dayIndex}`}
                            className={`h-2.5 w-2.5 rounded-full ${
                              day
                                ? dayIndex === todayIndex
                                  ? "bg-slate-950"
                                  : "bg-[var(--app-accent)]"
                                : "bg-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="ml-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-[var(--app-accent)]">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold">
                        <Flame aria-hidden="true" className="h-3.5 w-3.5" />
                        {streakCount}
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="rounded-[1.6rem] border border-dashed border-black/10 bg-white/40 px-6 py-10 text-center">
                <p className="text-sm font-medium text-slate-700">No habits</p>
              </div>
            )}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.75fr)]">
        <section className="app-card overflow-hidden">
          <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">Week</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Activity
              </h2>
            </div>
            <div className="rounded-[1.3rem] border border-black/10 bg-white/60 px-4 py-3 text-sm text-slate-600">
              % + min
            </div>
          </div>
          <ResponsiveContainer height={220} width="100%">
            <BarChart barCategoryGap="30%" barGap={4} data={chartData}>
              <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
              <XAxis
                axisLine={false}
                dataKey="day"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickLine={false}
                unit="%"
                yAxisId="habits"
                domain={[0, 100]}
              />
              <YAxis
                axisLine={false}
                orientation="right"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickLine={false}
                unit="m"
                yAxisId="focus"
              />
              <ChartTooltip
                contentStyle={{
                  borderRadius: "20px",
                  border: "1px solid rgba(15, 23, 42, 0.08)",
                  boxShadow: "0 18px 35px rgba(15, 23, 42, 0.14)",
                  backgroundColor: "rgba(255, 252, 245, 0.96)",
                }}
                cursor={{ fill: "#f8fafc" }}
              />
              <Bar
                dataKey="habits"
                fill="#18181b"
                name="Habits"
                radius={[10, 10, 0, 0]}
                yAxisId="habits"
              />
              <Bar
                dataKey="focus"
                fill="#d9f247"
                name="Focus"
                radius={[10, 10, 0, 0]}
                yAxisId="focus"
              />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <article className="app-card">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">Focus</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Strip
              </h2>
            </div>
            <Link className="text-sm font-medium text-slate-600 transition hover:text-slate-950" to="/pomodoro">
              Timer
            </Link>
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.6rem] bg-slate-950 p-5 text-white">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/55">Today</p>
                  <p className="mt-3 text-4xl font-semibold tracking-[-0.05em]">{focusMinutes}</p>
                </div>
                <p className="text-sm text-white/65">min</p>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {chartData.map((entry) => {
                const height = Math.max(18, Math.min(100, entry.focus));

                return (
                  <div key={entry.day} className="flex flex-col items-center gap-2">
                    <div className="flex h-28 w-full items-end rounded-[1.25rem] bg-slate-100 p-2">
                      <div
                        className="w-full rounded-[0.9rem] bg-slate-950"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <span className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                      {entry.day}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-[1.35rem] border border-black/5 bg-white/55 p-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Sessions</p>
                <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                  {completedPomodoros}
                </p>
              </div>
              <div className="rounded-[1.35rem] border border-black/5 bg-white/55 p-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Tasks</p>
                <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                  {completedTodayTasks}
                </p>
              </div>
              <div className="rounded-[1.35rem] border border-black/5 bg-white/55 p-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Open</p>
                <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                  {Math.max(totalTodayTasks - completedTodayTasks, 0)}
                </p>
              </div>
            </div>
          </div>
        </article>
      </section>

      {showModal && <AddModal />}
    </main>
  );
}

export default DashboardPage;
