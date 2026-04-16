import { useMemo } from "react";
import { useHabits } from "../../context/HabitContext";
import { useTasks } from "../../context/TasksContext";
import { mockDashboardMonth } from "../../lib/mockDashboardMonth";
import type { Habit } from "../../types/habit";
import type { Task } from "../../types/task";
import CalendarCard from "./CalendarCard";

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
    const taskEntries =
      dayRealTasks.length > 0
        ? dayRealTasks.slice(0, 7).map((task) => ({ task: task.name, done: task.isCompleted }))
        : day.tasks;
    const habitsData =
      habits.length > 0
        ? habits.map((habit) => ({ name: habit.name, completed: habit.days[dayIndex] ?? false }))
        : day.habits;

    return { ...day, tasks: taskEntries, habits: habitsData };
  }),
});

export default function LazyCalendarCard(): JSX.Element {
  const { tasks } = useTasks();
  const { habits } = useHabits();
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

  return (
    <CalendarCard
      activeWeek={syncedActiveWeek}
      weeks={syncedWeeks}
      todayDate={todayDate}
      multiDayTasks={[]}
    />
  );
}
