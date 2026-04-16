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
    <main className="h-full overflow-hidden" id="main-content" tabIndex={-1}>
      <div className="h-full min-w-[1280px] flex flex-col">
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

        <div className="grid flex-1 min-h-0 grid-cols-4 grid-rows-4 gap-3 mt-6">
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
