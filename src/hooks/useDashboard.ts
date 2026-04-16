import { useMemo } from "react";
import { mockDashboardMonth } from "../lib/mockDashboardMonth";
import { buildMockHabitHeatmapEntries } from "../lib/mockHabitHeatmap";
import type { HabitHeatmapEntry } from "../lib/mockHabitHeatmap";
import { useTasks } from "../context/TasksContext";
import { useHabits } from "../context/HabitContext";
import { useTimeTracker } from "../context/TimeTrackerContext";
import type { MockDashboardWeek } from "../lib/mockDashboardMonth";
import type { Habit } from "../types/habit";
import type { Task } from "../types/task";

// Mon=0 … Sun=6 (matches the habit days[] index)
const DAY_NAME_TO_INDEX: Record<string, number> = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
};

export const getLocalIsoDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatFocusLabel = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) return `${remainingMinutes}m`;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
};

const isDateInRange = (date: string, rangeStart: string, rangeEnd: string): boolean =>
  date >= rangeStart && date <= rangeEnd;

const getTodayDayIndex = (): number => {
  const weekday = new Date().getDay(); // 0=Sun … 6=Sat
  return weekday === 0 ? 6 : weekday - 1;
};

const calculateCurrentHabitStreak = (percentages: number[], todayDayIndex: number): number => {
  let streak = 0;
  const startIndex = percentages[todayDayIndex] === 0 ? todayDayIndex - 1 : todayDayIndex;
  for (let i = startIndex; i >= 0; i -= 1) {
    if (percentages[i] === 0) break;
    streak += 1;
  }
  return streak;
};

const buildSyncedActiveWeek = (
  activeWeek: MockDashboardWeek,
  tasks: Task[],
  habits: Habit[],
): MockDashboardWeek => ({
  ...activeWeek,
  days: activeWeek.days.map((day) => {
    const dayIndex = DAY_NAME_TO_INDEX[day.day] ?? 0;
    const dayRealTasks = tasks.filter((t) => t.date === day.date);
    const mockTasks =
      dayRealTasks.length > 0
        ? dayRealTasks.slice(0, 7).map((t) => ({ task: t.name, done: t.isCompleted }))
        : day.tasks;
    const habitsData =
      habits.length > 0
        ? habits.map((h) => ({ name: h.name, completed: h.days[dayIndex] ?? false }))
        : day.habits;
    return { ...day, tasks: mockTasks, habits: habitsData };
  }),
});

export interface FocusChartDayData {
  day: string;
  focusMinutes: number;
  label: string;
  isToday: boolean;
  isMuted: boolean;
  isFuture: boolean;
}

export interface DashboardStats {
  realTodayDate: string;
  todayTasks: Task[];
  completedTodayTasks: number;
  totalTodayTasks: number;
  completedHabitsToday: number;
  totalDailyHabits: number;
  habitPct: number;
  currentStreak: number;
  totalHabits: number;
  focusMinutes: number;
  sampleFocusHours: string;
  completedPomodoros: number;
  weeklyGoalAverage: number;
  syncedActiveWeek: MockDashboardWeek;
  syncedWeeks: MockDashboardWeek[];
  focusChartData: FocusChartDayData[];
  habitHeatmapEntries: HabitHeatmapEntry[];
  handleCheckboxChange: (taskId: string) => void;
}

export function useDashboard(): DashboardStats {
  const { tasks, handleCheckboxChange } = useTasks();
  const { habits, percentages, weekDates } = useHabits();
  const {
    dailyFocusSeconds,
    todayFocusSeconds,
    completedPomodoros: timerPomodoros,
  } = useTimeTracker();

  const realTodayDate = getLocalIsoDate(new Date());
  const todayDayIndex = getTodayDayIndex();

  const activeWeek = useMemo(
    () =>
      mockDashboardMonth.weeks.find((week) =>
        week.days.some((day) => day.date === realTodayDate),
      ) ?? mockDashboardMonth.weeks[mockDashboardMonth.weeks.length - 1],
    [realTodayDate],
  );

  const syncedActiveWeek = useMemo(
    () => buildSyncedActiveWeek(activeWeek, tasks, habits),
    [activeWeek, tasks, habits],
  );

  const syncedWeeks = useMemo(
    () =>
      mockDashboardMonth.weeks.map((week) =>
        week.week === activeWeek.week ? syncedActiveWeek : week,
      ),
    [activeWeek.week, syncedActiveWeek],
  );

  const todayTasks = useMemo(
    () => tasks.filter((task) => task.date === realTodayDate),
    [tasks, realTodayDate],
  );

  const completedTodayTasks = todayTasks.filter((t) => t.isCompleted).length;
  const totalTodayTasks = todayTasks.length;
  const completedHabitsToday = habits.filter((h) => h.days[todayDayIndex]).length;
  const totalDailyHabits = habits.length;
  const habitPct =
    totalDailyHabits === 0
      ? 0
      : Math.round((completedHabitsToday / totalDailyHabits) * 100);
  const currentStreak = calculateCurrentHabitStreak(percentages, todayDayIndex);
  const totalHabits = habits.length;
  const focusMinutes = Math.round(todayFocusSeconds / 60);
  const sampleFocusHours = formatFocusLabel(focusMinutes);
  const completedPomodoros = timerPomodoros;

  const focusChartData = useMemo<FocusChartDayData[]>(
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
  const weekEndDate = getLocalIsoDate(weekDates[weekDates.length - 1] ?? new Date());

  const currentWeekTasks = useMemo(
    () => tasks.filter((task) => isDateInRange(task.date, weekStartDate, weekEndDate)),
    [tasks, weekEndDate, weekStartDate],
  );

  const completedWeekTasks = currentWeekTasks.filter((t) => t.isCompleted).length;
  const weeklyTaskPct =
    currentWeekTasks.length === 0
      ? 0
      : Math.round((completedWeekTasks / currentWeekTasks.length) * 100);
  const weeklyHabitPct =
    percentages.length === 0
      ? 0
      : Math.round(percentages.reduce((sum, p) => sum + p, 0) / percentages.length);
  const weeklyGoalAverage = Math.round((weeklyTaskPct + weeklyHabitPct) / 2);

  const habitHeatmapEntries = useMemo<HabitHeatmapEntry[]>(() => {
    const generated = buildMockHabitHeatmapEntries();
    if (habits.length === 0) return generated;
    const totalHabitsCount = habits.length;
    const weekDateMap = new Map<string, number>(
      weekDates.map((date, index) => [
        getLocalIsoDate(date),
        habits.filter((h) => h.days[index]).length,
      ]),
    );
    return generated.map((entry) => {
      const realCount = weekDateMap.get(entry.date);
      if (realCount !== undefined) {
        return { ...entry, completedHabits: realCount, totalHabits: totalHabitsCount };
      }
      return entry;
    });
  }, [habits, weekDates]);

  return {
    realTodayDate,
    todayTasks,
    completedTodayTasks,
    totalTodayTasks,
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
  };
}
