import { useMemo } from "react";
import { useHabits } from "../context/HabitContext";
import { useTasks } from "../context/TasksContext";
import { useTimeTracker } from "../context/TimeTrackerContext";
import type { ProgressChartItem } from "../components/dashboard/FocusChartBar";

const getLocalIsoDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatFocusLabel = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes}m`;
  if (remainingMinutes === 0) return `${hours}h`;

  return `${hours}h ${remainingMinutes}m`;
};

const getTodayDayIndex = (): number => {
  const weekday = new Date().getDay();
  return weekday === 0 ? 6 : weekday - 1;
};

const calculateCurrentHabitStreak = (percentages: number[], todayDayIndex: number): number => {
  let streak = 0;
  const startIndex = percentages[todayDayIndex] === 0 ? todayDayIndex - 1 : todayDayIndex;

  for (let index = startIndex; index >= 0; index -= 1) {
    if (percentages[index] === 0) {
      break;
    }

    streak += 1;
  }

  return streak;
};

const isDateInRange = (date: string, rangeStart: string, rangeEnd: string): boolean =>
  date >= rangeStart && date <= rangeEnd;

export type DashboardOverview = {
  realTodayDate: string;
  completedTodayTasks: number;
  totalTodayTasks: number;
  todayTasks: ReturnType<typeof useTasks>["tasks"];
  completedHabitsToday: number;
  totalDailyHabits: number;
  habitPct: number;
  currentStreak: number;
  totalHabits: number;
  focusMinutes: number;
  sampleFocusHours: string;
  completedPomodoros: number;
  weeklyGoalAverage: number;
  focusChartData: ProgressChartItem[];
  handleCheckboxChange: (taskId: string) => void;
};

export function useDashboardOverview(): DashboardOverview {
  const { tasks, handleCheckboxChange } = useTasks();
  const { habits, percentages, weekDates } = useHabits();
  const {
    dailyFocusSeconds,
    todayFocusSeconds,
    completedPomodoros,
  } = useTimeTracker();

  const realTodayDate = getLocalIsoDate(new Date());
  const todayDayIndex = getTodayDayIndex();

  const todayTasks = useMemo(
    () => tasks.filter((task) => task.date === realTodayDate),
    [realTodayDate, tasks],
  );

  const completedTodayTasks = todayTasks.filter((task) => task.isCompleted).length;
  const totalTodayTasks = todayTasks.length;
  const completedHabitsToday = habits.filter((habit) => habit.days[todayDayIndex]).length;
  const totalDailyHabits = habits.length;
  const habitPct =
    totalDailyHabits === 0
      ? 0
      : Math.round((completedHabitsToday / totalDailyHabits) * 100);
  const currentStreak = calculateCurrentHabitStreak(percentages, todayDayIndex);
  const totalHabits = habits.length;
  const focusMinutes = Math.round(todayFocusSeconds / 60);
  const sampleFocusHours = formatFocusLabel(focusMinutes);

  const focusChartData = useMemo<ProgressChartItem[]>(
    () =>
      weekDates.map((date) => {
        const isoDate = getLocalIsoDate(date);
        const focusTimeMinutes = Math.round((dailyFocusSeconds[isoDate] ?? 0) / 60);

        return {
          day: date.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1),
          focusMinutes: focusTimeMinutes,
          label: formatFocusLabel(focusTimeMinutes),
          isToday: isoDate === realTodayDate,
          isMuted: focusTimeMinutes <= 70,
          isFuture: isoDate > realTodayDate,
        };
      }),
    [dailyFocusSeconds, realTodayDate, weekDates],
  );

  const weekStartDate = getLocalIsoDate(weekDates[0] ?? new Date());
  const weekEndDate = getLocalIsoDate(weekDates[weekDates.length - 1] ?? new Date());

  const currentWeekTasks = useMemo(
    () => tasks.filter((task) => isDateInRange(task.date, weekStartDate, weekEndDate)),
    [tasks, weekEndDate, weekStartDate],
  );

  const completedWeekTasks = currentWeekTasks.filter((task) => task.isCompleted).length;
  const weeklyTaskPct =
    currentWeekTasks.length === 0
      ? 0
      : Math.round((completedWeekTasks / currentWeekTasks.length) * 100);
  const weeklyHabitPct =
    percentages.length === 0
      ? 0
      : Math.round(percentages.reduce((sum, percentage) => sum + percentage, 0) / percentages.length);
  const weeklyGoalAverage = Math.round((weeklyTaskPct + weeklyHabitPct) / 2);

  return {
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
    focusChartData,
    handleCheckboxChange,
  };
}
