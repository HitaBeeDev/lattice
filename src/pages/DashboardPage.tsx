import { mockDashboardMonth } from "../lib/mockDashboardMonth";
import StatsBar from "../components/dashboard/StatsBar";
import CalendarCard from "../components/dashboard/CalendarCard";
import ProgressCard from "../components/dashboard/ProgressCard";
import TimeTrackerCard from "../components/dashboard/TimeTrackerCard";
import TodoOverviewCard from "../components/dashboard/TodoOverviewCard";
import { mockTasks } from "../lib/mockData";
const WEEKLY_OUTPUT_TARGET_MINUTES = 3200;

const formatFocusLabel = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
};

const calculateHabitStreak = (completionDays: boolean[]): number => {
  let streak = 0;

  for (let index = completionDays.length - 1; index >= 0; index -= 1) {
    if (!completionDays[index]) {
      break;
    }

    streak += 1;
  }

  return streak;
};

const getLocalIsoDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function DashboardPage() {
  const realTodayDate = getLocalIsoDate(new Date());

  const activeWeek =
    mockDashboardMonth.weeks.find((week) =>
      week.days.some((day) => day.date === realTodayDate),
    ) ?? mockDashboardMonth.weeks[mockDashboardMonth.weeks.length - 1];
  const selectedDay =
    activeWeek.days.find((day) => day.date === realTodayDate) ??
    activeWeek.days[0];

  const totalTodayTasks = selectedDay.todos.length;
  const completedTodayTasks = selectedDay.todos.filter(
    (todo) => todo.done,
  ).length;
  const completedHabitsToday = selectedDay.habits.filter(
    (habit) => habit.completed,
  ).length;
  const totalDailyHabits = selectedDay.habits.length;
  const habitPct =
    totalDailyHabits === 0
      ? 0
      : Math.round((completedHabitsToday / totalDailyHabits) * 100);
  const focusMinutes = selectedDay.focusTimeMinutes;
  const sampleFocusHours = formatFocusLabel(focusMinutes);
  const todayTasks = mockTasks.filter((task) => task.date === realTodayDate);

  const focusChartData = activeWeek.days.map((day) => {
    const focusTimeMinutes = day.focusTimeMinutes;
    const isFuture = day.date > realTodayDate;

    return {
      day: day.day.slice(0, 1),
      focusMinutes: focusTimeMinutes,
      label: formatFocusLabel(focusTimeMinutes),
      isToday: day.date === selectedDay.date,
      isMuted: focusTimeMinutes <= 70,
      isFuture,
    };
  });
  const weeklyFocusMinutes = activeWeek.days.reduce(
    (total, day) => total + day.focusTimeMinutes,
    0,
  );
  const weeklyGoalAverage = Math.round(
    Math.min((weeklyFocusMinutes / WEEKLY_OUTPUT_TARGET_MINUTES) * 100, 100),
  );
  const uniqueHabitNames = new Set(
    mockDashboardMonth.weeks.flatMap((week) =>
      week.days.flatMap((day) => day.habits.map((habit) => habit.name)),
    ),
  );
  const completionDays = activeWeek.days.map((day) =>
    day.habits.some((habit) => habit.completed),
  );
  const currentStreak = calculateHabitStreak(completionDays);
  const completedPomodoros = Math.round(weeklyFocusMinutes / 25);

  // #6F757B
  // #72e1ee
  // #f4f9fb

  return (
    <main className="h-full overflow-hidden" id="main-content" tabIndex={-1}>
      <div className="h-full min-w-[1280px] flex flex-col">
        {/* Row 1: Welcome Section */}
        <div className="mt-2">
          <p className="font-['Inter'] font-[300] text-[2.1rem] text-[#060a0f]">
            Welcome in, {mockDashboardMonth.name}
          </p>
        </div>

        {/* Stats Bar */}
        <StatsBar
          completedTodayTasks={completedTodayTasks}
          totalTodayTasks={totalTodayTasks}
          completedHabitsToday={completedHabitsToday}
          totalDailyHabits={totalDailyHabits}
          habitPct={habitPct}
          focusMinutes={focusMinutes}
          weeklyGoalAverage={weeklyGoalAverage}
          currentStreak={currentStreak}
          totalHabits={uniqueHabitNames.size}
          completedPomodoros={completedPomodoros}
        />

        {/* Content Grid */}
        <div
          className="grid flex-1 min-h-0 grid-cols-4 gap-3 mt-6"
          style={{ gridTemplateRows: "repeat(4, minmax(0, 1fr))" }}
        >
          <ProgressCard
            sampleFocusHours={sampleFocusHours}
            focusChartData={focusChartData}
          />

          <CalendarCard
            activeWeek={activeWeek}
            weeks={mockDashboardMonth.weeks}
            todayDate={realTodayDate}
            multiDayTasks={[]}
          />

          <TodoOverviewCard tasks={todayTasks} />

          <TimeTrackerCard />

          <div className="w-full h-full col-span-2 row-span-1 row-start-4 rounded-[1.2rem] bg-[#cee2e9]/40">
            z
          </div>
        </div>
      </div>
    </main>
  );
}

export default DashboardPage;
