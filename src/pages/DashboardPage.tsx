import { useDashboard } from "../hooks/useDashboard";
import { mockUser } from "../lib/mockData";
import StatsBar from "../components/dashboard/StatsBar";
import CalendarCard from "../components/dashboard/CalendarCard";
import ProgressCard from "../components/dashboard/ProgressCard";
import TimeTrackerCard from "../components/dashboard/TimeTrackerCard";
import TaskOverviewCard from "../components/dashboard/TaskOverviewCard";
import HabitConsistencyCard from "../components/dashboard/HabitConsistencyCard";

function DashboardPage() {
  const {
    realTodayDate,
    completedTodayTasks,
    totalTodayTasks,
    todayTasks,
    completedHabitsToday,
    totalDailyHabits,
    habitPct,
    currentStreak,
    totalHabits,
    focusMinutes,
    sampleFocusHours,
    completedPomodoros,
    weeklyGoalAverage,
    syncedActiveWeek,
    syncedWeeks,
    focusChartData,
    habitHeatmapEntries,
    handleCheckboxChange,
  } = useDashboard();

  return (
    <main className="h-full overflow-y-auto lg:overflow-hidden" id="main-content" tabIndex={-1}>
      <div className="flex flex-col lg:h-full">
        <div className="mt-8">
          <p className="font-['Inter'] font-[300] text-[2.1rem] text-[#060a0f]">
            Welcome in, {mockUser.name}
          </p>
        </div>

        <StatsBar
          completedTodayTasks={completedTodayTasks}
          totalTodayTasks={totalTodayTasks}
          completedHabitsToday={completedHabitsToday}
          totalDailyHabits={totalDailyHabits}
          habitPct={habitPct}
          focusMinutes={focusMinutes}
          weeklyGoalAverage={weeklyGoalAverage}
          currentStreak={currentStreak}
          totalHabits={totalHabits}
          completedPomodoros={completedPomodoros}
        />

        <div className="grid gap-3 mt-6 grid-cols-1 sm:grid-cols-2 lg:flex-1 lg:min-h-0 lg:grid-cols-4 lg:grid-rows-4 pb-6 lg:pb-0">
          <ProgressCard
            sampleFocusHours={sampleFocusHours}
            focusChartData={focusChartData}
          />

          <CalendarCard
            activeWeek={syncedActiveWeek}
            weeks={syncedWeeks}
            todayDate={realTodayDate}
            multiDayTasks={[]}
          />

          <TaskOverviewCard
            tasks={todayTasks}
            onToggleTask={handleCheckboxChange}
          />

          <TimeTrackerCard />

          <HabitConsistencyCard entries={habitHeatmapEntries} />
        </div>
      </div>
    </main>
  );
}

export default DashboardPage;
