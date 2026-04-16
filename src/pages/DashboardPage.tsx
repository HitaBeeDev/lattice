import { useMemo } from "react";
import { mockDashboardMonth } from "../lib/mockDashboardMonth";
import { mockUser } from "../lib/mockData";
import StatsBar from "../components/dashboard/StatsBar";
import CalendarCard from "../components/dashboard/CalendarCard";
import ProgressCard from "../components/dashboard/ProgressCard";
import TimeTrackerCard from "../components/dashboard/TimeTrackerCard";
import TaskOverviewCard from "../components/dashboard/TaskOverviewCard";
import HabitConsistencyCard, {
  buildMockHabitHeatmapEntries,
} from "../components/dashboard/HabitConsistencyCard";
import { useTasks } from "../context/TasksContext";
import { useHabits } from "../context/HabitContext";
import { useTimeTracker } from "../context/TimeTrackerContext";
import type { MockDashboardWeek } from "../lib/mockDashboardMonth";
import type { Habit } from "../types/habit";
import type { Task } from "../types/task";

// Mon=0 … Sun=6  (matches the habit days[] index)
const DAY_NAME_TO_INDEX: Record<string, number> = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
};

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

const getLocalIsoDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const isDateInRange = (
  date: string,
  rangeStart: string,
  rangeEnd: string,
): boolean => date >= rangeStart && date <= rangeEnd;

/** Returns the index (Mon=0 … Sun=6) for today. */
const getTodayDayIndex = (): number => {
  const weekday = new Date().getDay(); // 0=Sun, 1=Mon, …, 6=Sat
  return weekday === 0 ? 6 : weekday - 1;
};

/**
 * Count consecutive days with at least one habit completed, working backwards
 * from todayDayIndex through the start of the week.
 * If today has no completions yet (day not done), start from yesterday so an
 * active prior streak isn't shown as 0 just because today hasn't started.
 */
const calculateCurrentHabitStreak = (
  percentages: number[],
  todayDayIndex: number,
): number => {
  let streak = 0;
  const startIndex =
    percentages[todayDayIndex] === 0 ? todayDayIndex - 1 : todayDayIndex;

  for (let i = startIndex; i >= 0; i -= 1) {
    if (percentages[i] === 0) {
      break;
    }

    streak += 1;
  }

  return streak;
};

/**
 * Returns a copy of `activeWeek` where each day's tasks and habits are
 * replaced with live data when real records exist for that date.
 * Days that have no real tasks keep their original mock tasks.
 * Habits are always synced from the DB if any habits are loaded.
 */
const buildSyncedActiveWeek = (
  activeWeek: MockDashboardWeek,
  tasks: Task[],
  habits: Habit[],
): MockDashboardWeek => ({
  ...activeWeek,
  days: activeWeek.days.map((day) => {
    const dayIndex = DAY_NAME_TO_INDEX[day.day] ?? 0;

    // Sync tasks: use real tasks for this day when available, else keep mock
    const dayRealTasks = tasks.filter((t) => t.date === day.date);
    const mockTasks =
      dayRealTasks.length > 0
        ? dayRealTasks.slice(0, 7).map((t) => ({
            task: t.name,
            done: t.isCompleted,
          }))
        : day.tasks;

    // Sync habits: use live DB habits when loaded, else keep mock
    const habitsData =
      habits.length > 0
        ? habits.map((h) => ({
            name: h.name,
            completed: h.days[dayIndex] ?? false,
          }))
        : day.habits;

    return { ...day, tasks: mockTasks, habits: habitsData };
  }),
});

function DashboardPage() {
  const { tasks, handleCheckboxChange } = useTasks();
  const { habits, percentages, weekDates } = useHabits();
  const {
    dailyFocusSeconds,
    todayFocusSeconds,
    completedPomodoros: timerPomodoros,
  } = useTimeTracker();

  const realTodayDate = getLocalIsoDate(new Date());
  const todayDayIndex = getTodayDayIndex();

  // ── Calendar week ──────────────────────────────────────────────────────────
  const activeWeek =
    mockDashboardMonth.weeks.find((week) =>
      week.days.some((day) => day.date === realTodayDate),
    ) ?? mockDashboardMonth.weeks[mockDashboardMonth.weeks.length - 1];

  const syncedActiveWeek = useMemo(
    () => buildSyncedActiveWeek(activeWeek, tasks, habits),
    [activeWeek, tasks, habits],
  );

  // Replace the active week in the full weeks list so calendar navigation also
  // shows real data for the current week.
  const syncedWeeks = useMemo(
    () =>
      mockDashboardMonth.weeks.map((week) =>
        week.week === activeWeek.week ? syncedActiveWeek : week,
      ),
    [activeWeek.week, syncedActiveWeek],
  );

  // ── Task stats (from real Dexie data) ─────────────────────────────────────
  const todayTasks = useMemo(
    () => tasks.filter((task) => task.date === realTodayDate),
    [tasks, realTodayDate],
  );
  const totalTodayTasks = todayTasks.length;
  const completedTodayTasks = todayTasks.filter((t) => t.isCompleted).length;

  // ── Habit stats (from real Dexie data) ────────────────────────────────────
  const completedHabitsToday = habits.filter(
    (h) => h.days[todayDayIndex],
  ).length;
  const totalDailyHabits = habits.length;
  const habitPct =
    totalDailyHabits === 0
      ? 0
      : Math.round((completedHabitsToday / totalDailyHabits) * 100);

  const currentStreak = calculateCurrentHabitStreak(percentages, todayDayIndex);
  const totalHabits = habits.length;

  // ── Focus / Pomodoro stats (from real localStorage timer) ─────────────────
  const focusMinutes = Math.round(todayFocusSeconds / 60);
  const sampleFocusHours = formatFocusLabel(focusMinutes);
  const completedPomodoros = timerPomodoros;

  // Focus chart: use real dailyFocusSeconds keyed by ISO date
  const focusChartData = useMemo(
    () =>
      activeWeek.days.map((day) => {
        const focusTimeSeconds = dailyFocusSeconds[day.date] ?? 0;
        const focusTimeMinutes = Math.round(focusTimeSeconds / 60);
        const isFuture = day.date > realTodayDate;

        return {
          day: day.day.slice(0, 1),
          focusMinutes: focusTimeMinutes,
          label: formatFocusLabel(focusTimeMinutes),
          isToday: day.date === realTodayDate,
          isMuted: focusTimeMinutes <= 70,
          isFuture,
        };
      }),
    [activeWeek.days, dailyFocusSeconds, realTodayDate],
  );

  const weekStartDate = getLocalIsoDate(weekDates[0] ?? new Date());
  const weekEndDate = getLocalIsoDate(
    weekDates[weekDates.length - 1] ?? new Date(),
  );
  const currentWeekTasks = useMemo(
    () =>
      tasks.filter((task) =>
        isDateInRange(task.date, weekStartDate, weekEndDate),
      ),
    [tasks, weekEndDate, weekStartDate],
  );
  const completedWeekTasks = currentWeekTasks.filter(
    (task) => task.isCompleted,
  ).length;
  const weeklyTaskPct =
    currentWeekTasks.length === 0
      ? 0
      : Math.round((completedWeekTasks / currentWeekTasks.length) * 100);
  const weeklyHabitPct =
    percentages.length === 0
      ? 0
      : Math.round(
          percentages.reduce((sum, percentage) => sum + percentage, 0) /
            percentages.length,
        );
  const weeklyGoalAverage = Math.round((weeklyTaskPct + weeklyHabitPct) / 2);

  // ── Habit heatmap: generated history + real current-week data ─────────────
  const habitHeatmapEntries = useMemo(() => {
    const generated = buildMockHabitHeatmapEntries();

    if (habits.length === 0) {
      return generated;
    }

    const totalHabitsCount = habits.length;

    // Map current-week ISO dates → real completed habit count
    const weekDateMap = new Map<string, number>(
      weekDates.map((date, index) => [
        getLocalIsoDate(date),
        habits.filter((h) => h.days[index]).length,
      ]),
    );

    return generated.map((entry) => {
      const realCount = weekDateMap.get(entry.date);

      if (realCount !== undefined) {
        return {
          ...entry,
          completedHabits: realCount,
          totalHabits: totalHabitsCount,
        };
      }

      return entry;
    });
  }, [habits, weekDates]);

  return (
    <main className="h-full overflow-hidden" id="main-content" tabIndex={-1}>
      <div className="h-full min-w-[1280px] flex flex-col">
        {/* Row 1: Welcome Section */}
        <div className="mt-8">
          <p className="font-['Inter'] font-[300] text-[2.1rem] text-[#060a0f]">
            Welcome in, {mockUser.name}
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
          totalHabits={totalHabits}
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
