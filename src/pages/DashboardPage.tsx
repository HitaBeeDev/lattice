import { useMemo } from "react";
import CalendarCard from "../components/dashboard/CalendarCard";
import TaskOverviewCard from "../components/dashboard/TaskOverviewCard";
import { mockUser } from "../lib/mockUser";
import { mockDashboardMonth } from "../lib/mockDashboardMonth";
import StatsBar from "../components/dashboard/StatsBar";
import ProgressCard from "../components/dashboard/ProgressCard";
import TimeTrackerCard from "../components/dashboard/TimeTrackerCard";
import HabitConsistencyCard from "../components/dashboard/HabitConsistencyCard";
import { useHabits } from "../context/HabitContext";
import { useTasks } from "../context/TasksContext";
import { useDashboardOverview } from "../hooks/useDashboardOverview";
import { buildMockHabitHeatmapEntries } from "../lib/mockHabitHeatmap";
import type { Habit } from "../types/habit";
import type { Task } from "../types/task";

const DAY_NAME_TO_INDEX: Record<string, number> = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
};

const getLocalIsoDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const buildSyncedActiveWeek = (
  activeWeek: (typeof mockDashboardMonth.weeks)[number],
  tasks: Task[],
  habits: Habit[],
) => ({
  ...activeWeek,
  days: activeWeek.days.map((day) => {
    const dayIndex = DAY_NAME_TO_INDEX[day.day] ?? 0;
    const dayRealTasks = tasks.filter((task) => task.date === day.date);

    return {
      ...day,
      tasks:
        dayRealTasks.length > 0
          ? dayRealTasks.slice(0, 7).map((task) => ({
              task: task.name,
              done: task.isCompleted,
            }))
          : day.tasks,
      habits:
        habits.length > 0
          ? habits.map((habit) => ({
              name: habit.name,
              completed: habit.days[dayIndex] ?? false,
            }))
          : day.habits,
    };
  }),
});

function DashboardPage() {
  const { tasks } = useTasks();
  const { habits, weekDates } = useHabits();
  const {
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
    focusChartData,
    handleCheckboxChange,
  } = useDashboardOverview();
  const todayDate = getLocalIsoDate(new Date());

  const activeWeek = useMemo(
    () =>
      mockDashboardMonth.weeks.find((week) =>
        week.days.some((day) => day.date === todayDate),
      ) ?? mockDashboardMonth.weeks[mockDashboardMonth.weeks.length - 1],
    [todayDate],
  );

  const syncedActiveWeek = useMemo(
    () => buildSyncedActiveWeek(activeWeek, tasks, habits),
    [activeWeek, habits, tasks],
  );

  const syncedWeeks = useMemo(
    () =>
      mockDashboardMonth.weeks.map((week) =>
        week.week === activeWeek.week ? syncedActiveWeek : week,
      ),
    [activeWeek.week, syncedActiveWeek],
  );

  const entries = useMemo(() => {
    const generated = buildMockHabitHeatmapEntries();

    if (habits.length === 0) {
      return generated;
    }

    const totalHabitsCount = habits.length;
    const weekDateMap = new Map<string, number>(
      weekDates.map((date, index) => [
        getLocalIsoDate(date),
        habits.filter((habit) => habit.days[index]).length,
      ]),
    );

    return generated.map((entry) => {
      const completedHabits = weekDateMap.get(entry.date);

      if (completedHabits === undefined) {
        return entry;
      }

      return { ...entry, completedHabits, totalHabits: totalHabitsCount };
    });
  }, [habits, weekDates]);

  return (
    <main
      className="h-full overflow-y-auto lg:overflow-hidden"
      id="main-content"
      tabIndex={-1}
    >
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

        <div className="grid h-full min-h-[70vh] grid-cols-4 grid-rows-4 gap-3 mt-6">
          <div className="h-full col-span-1 row-span-2">
            <ProgressCard
              sampleFocusHours={sampleFocusHours}
              focusChartData={focusChartData}
            />
          </div>

          <div className="h-full col-span-2 row-span-3">
            <CalendarCard
              activeWeek={syncedActiveWeek}
              weeks={syncedWeeks}
              todayDate={todayDate}
              multiDayTasks={[]}
            />
          </div>

          <div className="h-full col-span-1 row-span-4">
            <TaskOverviewCard
              tasks={todayTasks}
              onToggleTask={handleCheckboxChange}
            />
          </div>

          <div className="h-full col-span-1 row-span-2">
            <TimeTrackerCard />
          </div>

          <div className="h-full col-span-2 row-span-1">
            <HabitConsistencyCard entries={entries} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default DashboardPage;
