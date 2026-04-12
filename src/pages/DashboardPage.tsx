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
        <Skeleton key={i} className="h-32 rounded-3xl" />
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
    <main className="space-y-6 p-6">
      <DashboardHeader
        formattedDate={formattedDate}
        greeting={greeting}
        onAddTask={handleAddButtonClick}
      />

      {/* Top row: welcome card + daily habits */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WelcomeCard />
        </div>
        <DailyHabitsCard
          habits={dailyHabits}
          todayIndex={todayIndex}
          toggleDayMark={toggleDayMark}
        />
      </div>

      {/* Stats — skeleton while data loads */}
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

      {/* Weekly activity chart */}
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-6 text-lg font-semibold text-slate-900">
          Weekly Activity
        </h2>
        <ResponsiveContainer height={220} width="100%">
          <BarChart
            barCategoryGap="30%"
            barGap={4}
            data={chartData}
          >
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
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              cursor={{ fill: "#f8fafc" }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
            />
            <Bar
              dataKey="habits"
              fill="#6366f1"
              name="Habits %"
              radius={[4, 4, 0, 0]}
              yAxisId="habits"
            />
            <Bar
              dataKey="focus"
              fill="#22d3ee"
              name="Focus (min)"
              radius={[4, 4, 0, 0]}
              yAxisId="focus"
            />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Widget row: upcoming tasks, habit list, focus tip */}
      <div className="grid gap-6 lg:grid-cols-3">
        <TasksWidget />
        <HabitWidget />
        <TimeTrackerWidget />
      </div>

      {/* Weekly habit performance summary */}
      <ReportWidgets />

      {showModal && <AddModal />}
    </main>
  );
}

export default DashboardPage;
