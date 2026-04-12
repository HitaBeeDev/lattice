import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";
import AddModal from "../components/tasks/AddModal";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import DailyHabitsCard from "../components/dashboard/DailyHabitsCard";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardStats from "../components/dashboard/DashboardStats";
import HabitWidget from "../components/habits/HabitWidget";
import TasksWidget from "../components/tasks/TasksWidget";
import TimeTrackerWidget from "../components/pomodoro/TimeTrackerWidget";
import ReportWidgets from "../components/habits/ReportWidgets";
import { CheckIcon, ClockIcon, FlameIcon } from "../components/dashboard/dashboardIcons";
import {
  calculateCurrentStreak,
  formatDuration,
  getGreeting,
} from "../components/dashboard/dashboardUtils";
import { ArrowUpRight } from "lucide-react";
import { Skeleton } from "../components/ui";
import { useHabits } from "../context/HabitContext";
import { useTasks } from "../context/TasksContext";
import { useTimeTracker } from "../context/TimeTrackerContext";

const MAX_DAILY_HABITS = 5;

const TODAY_KEY = new Date().toISOString().slice(0, 10);

function StatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="h-36 rounded-[2rem]" />
      ))}
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

  // Today's task counts — keyed by ISO date "YYYY-MM-DD" matching <input type="date">
  const todayTasks = groupedTasks[TODAY_KEY] ?? [];
  const completedTodayTasks = todayTasks.filter((t) => t.isCompleted).length;
  const totalTodayTasks = todayTasks.length;

  const focusTime = formatDuration(todayFocusSeconds);
  const currentStreak = calculateCurrentStreak(percentages);
  const dailyHabits = habits.slice(0, MAX_DAILY_HABITS);

  const isStatsLoading = isTasksLoading || isHabitsLoading;

  // Weekly activity chart data — Mon through Sun
  const chartData = weekDates.map((date, index) => {
    const dateKey = date.toISOString().slice(0, 10);
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      habits: percentages[index] ?? 0,
      focus: Math.round((dailyFocusSeconds[dateKey] ?? 0) / 60),
    };
  });

  return (
    <main className="space-y-8 p-5 sm:p-6 lg:p-8" id="main-content" tabIndex={-1}>
      <DashboardHeader
        formattedDate={formattedDate}
        greeting={greeting}
        onAddTask={handleAddButtonClick}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(20rem,0.9fr)]">
        <div className="lg:col-span-2">
          <WelcomeCard />
        </div>
        <DailyHabitsCard
          habits={dailyHabits}
          todayIndex={todayIndex}
          toggleDayMark={toggleDayMark}
        />
      </div>

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

      <section className="app-card overflow-hidden">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
              Performance snapshot
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Weekly activity
            </h2>
          </div>
          <div className="rounded-[1.3rem] border border-black/10 bg-white/60 px-4 py-3 text-sm text-slate-600">
            Habits and focus minutes, Monday through Sunday
          </div>
        </div>
        <ResponsiveContainer height={220} width="100%">
          <BarChart barCategoryGap="30%" barGap={4} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
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
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
            />
            <Bar
              dataKey="habits"
              fill="#18181b"
              name="Habits %"
              radius={[10, 10, 0, 0]}
              yAxisId="habits"
            />
            <Bar
              dataKey="focus"
              fill="#d9f247"
              name="Focus (min)"
              radius={[10, 10, 0, 0]}
              yAxisId="focus"
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <article className="rounded-[1.6rem] border border-black/5 bg-white/55 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-600">Today</p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              {completedTodayTasks}/{totalTodayTasks || 0}
            </p>
            <p className="mt-1 text-sm text-slate-600">Tasks completed on schedule.</p>
          </article>
          <article className="rounded-[1.6rem] border border-black/5 bg-slate-950 p-4 text-white">
            <p className="text-xs uppercase tracking-[0.22em] text-white/80">Focus</p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">{focusTime}</p>
            <p className="mt-1 text-sm text-white/80">
              Deep work logged across your active sessions.
            </p>
          </article>
          <article className="rounded-[1.6rem] border border-black/5 bg-[var(--app-accent)]/70 p-4 text-slate-950">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-700">Streak</p>
                <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">{currentStreak} days</p>
              </div>
              <ArrowUpRight aria-hidden="true" className="h-5 w-5" />
            </div>
            <p className="mt-1 text-sm text-slate-700">Consistency is still compounding.</p>
          </article>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <TasksWidget />
        <HabitWidget />
        <TimeTrackerWidget />
      </div>

      <ReportWidgets />

      {showModal && <AddModal />}
    </main>
  );
}

export default DashboardPage;
