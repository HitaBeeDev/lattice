import { useCallback, useEffect, useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import habitQuotes from "../components/habits/habitQuotes";
import { db } from "../db/database";
import type { HabitFormValues } from "../lib/habitSchema";
import { MOBILE_NAV_BREAKPOINT } from "../lib/layoutConstants";
import type { Habit } from "../types/habit";
import { useRandomIndex } from "./useRandomIndex";

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "short",
  day: "2-digit",
  month: "short",
};

const DAY_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = { weekday: "short" };
const DAYS_PER_WEEK = 7;
const DEFAULT_HABIT_TARGET = 7;

export interface HabitCompletionStats {
  totalHabits: number;
  completedHabits: number;
}

export interface HabitContextValue {
  habits: Habit[];
  isLoading: boolean;
  editingHabitId: string | null;
  addHabit: (values: HabitFormValues) => void;
  startEdit: (habitId: string) => void;
  saveEdit: (habitId: string, name: string) => void;
  cancelEdit: () => void;
  deleteHabit: (habitId: string) => void;
  toggleDayMark: (habitId: string, dayIndex: number) => void;
  getWeekDates: () => Date[];
  formatDate: (date: Date) => string;
  formatDayOfWeek: (date: Date) => string;
  totalHabits: number;
  formattedToday: string;
  completedHabits: number;
  bestDayMessage: string;
  bestHabitMessage: string;
  averagePercentageForWeek: number;
  weekDates: Date[];
  percentages: number[];
  visibleWeekDates: Date[];
  quoteIndex: number;
}

const createHabitRecord = (values: HabitFormValues): Habit => {
  const timestamp = new Date().toISOString();
  const targetPerWeek = values.targetPerWeek ?? DEFAULT_HABIT_TARGET;
  const streakGoal = values.streakGoal;

  return {
    id: `habit-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    name: values.name.trim(),
    days: Array(DAYS_PER_WEEK).fill(false),
    category: "other",
    frequency: values.frequency,
    frequencyDays: values.frequency === "custom" ? (values.frequencyDays ?? []) : undefined,
    targetPerWeek,
    streakGoal,
    isArchived: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

const getWeekDates = (): Date[] => {
  const today = new Date();
  const currentDay = today.getDay();
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  return Array.from({ length: DAYS_PER_WEEK }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return date;
  });
};

const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat("en-US", DATE_FORMAT_OPTIONS).format(date);

const formatDayOfWeek = (date: Date): string =>
  new Intl.DateTimeFormat("en-US", DAY_FORMAT_OPTIONS).format(date);

export function useHabits(): HabitContextValue {
  const habitEntries = useLiveQuery<Habit[] | undefined>(() => db.habits.toArray(), []);
  const habits = useMemo<Habit[]>(() => habitEntries ?? [], [habitEntries]);
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const quoteIndex = useRandomIndex(habitQuotes.length);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect((): (() => void) => {
    const handleResize = (): void => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return (): void => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isLargeScreen = windowWidth >= MOBILE_NAV_BREAKPOINT;

  const addHabit = useCallback((values: HabitFormValues): void => {
    void db.habits.add(createHabitRecord(values));
  }, []);

  const startEdit = useCallback((habitId: string): void => {
    setEditingHabitId(habitId);
  }, []);

  const saveEdit = useCallback((habitId: string, name: string): void => {
    const habit = habits.find((entry) => entry.id === habitId);
    if (!habit) {
      return;
    }

    void db.habits.put({
      ...habit,
      name: name.trim(),
      updatedAt: new Date().toISOString(),
    });
    setEditingHabitId(null);
  }, [habits]);

  const cancelEdit = useCallback((): void => {
    setEditingHabitId(null);
  }, []);

  const deleteHabit = useCallback((habitId: string): void => {
    void db.habits.delete(habitId);
  }, []);

  const toggleDayMark = useCallback((habitId: string, dayIndex: number): void => {
    const habit = habits.find((entry) => entry.id === habitId);
    if (!habit) {
      return;
    }

    const updatedDays = [...habit.days];
    updatedDays[dayIndex] = !updatedDays[dayIndex];

    void db.habits.put({
      ...habit,
      days: updatedDays,
      updatedAt: new Date().toISOString(),
    });
  }, [habits]);

  const calculateHabitCompletion = useCallback((): HabitCompletionStats => {
    const totalHabitCount = habits.length;
    const completedHabitCount = habits.filter((habit) =>
      habit.days.every((day) => day)
    ).length;

    return { totalHabits: totalHabitCount, completedHabits: completedHabitCount };
  }, [habits]);

  const weekDates = useMemo(() => getWeekDates(), []);
  const formattedToday = useMemo(() => formatDate(new Date()), []);
  const { totalHabits, completedHabits } = useMemo(
    () => calculateHabitCompletion(),
    [calculateHabitCompletion]
  );

  const percentages = useMemo(() => {
    const totalHabitsCount = habits.length;
    return weekDates.map((_, index) => {
      const markedHabits = habits.filter((habit) => habit.days[index]).length;
      return totalHabitsCount !== 0
        ? Math.round((markedHabits / totalHabitsCount) * 100)
        : 0;
    });
  }, [habits, weekDates]);

  const bestDayMessage = useMemo(() => {
    const bestDays: string[] = [];
    percentages.forEach((percentage, index) => {
      if (percentage === 100) {
        bestDays.push(formatDayOfWeek(weekDates[index]));
      }
    });
    if (bestDays.length === 0) {
      return "Oops! It seems like you haven't completed any day 100%. Don't worry, there's always tomorrow!";
    }
    return bestDays.length === 1
      ? `Hooray! Your best day of the week was: ${bestDays[0]}`
      : `Yay! Your best days of the week were: ${bestDays.join(", ")}`;
  }, [percentages, weekDates]);

  const bestHabitMessage = useMemo(() => {
    const bestHabits = habits.filter((habit) => habit.days.every((day) => day));
    return bestHabits.length > 0
      ? `Keep up the great work! Your best habits this week: ${bestHabits.map((habit) => habit.name).join(", ")}. `
      : "No habits with 100% completion this week. Don't worry, there's always room for improvement!";
  }, [habits]);

  const calculateAveragePercentageForWeek = useCallback((): number => {
    const totalPercentage = percentages.reduce((sum, percentage) => sum + percentage, 0);
    return Math.round(totalPercentage / DAYS_PER_WEEK);
  }, [percentages]);

  const averagePercentageForWeek = useMemo(
    () => calculateAveragePercentageForWeek(),
    [calculateAveragePercentageForWeek]
  );

  const visibleWeekDates = useMemo(
    () => (isLargeScreen ? weekDates : [new Date()]),
    [isLargeScreen, weekDates]
  );

  return useMemo<HabitContextValue>(
    () => ({
      habits,
      isLoading: habitEntries === undefined,
      editingHabitId,
      addHabit,
      startEdit,
      saveEdit,
      cancelEdit,
      deleteHabit,
      toggleDayMark,
      getWeekDates,
      formatDate,
      formatDayOfWeek,
      totalHabits,
      formattedToday,
      completedHabits,
      bestDayMessage,
      bestHabitMessage,
      averagePercentageForWeek,
      weekDates,
      percentages,
      visibleWeekDates,
      quoteIndex,
    }),
    [
      habits,
      habitEntries,
      editingHabitId,
      addHabit,
      startEdit,
      saveEdit,
      cancelEdit,
      deleteHabit,
      toggleDayMark,
      totalHabits,
      formattedToday,
      completedHabits,
      bestDayMessage,
      bestHabitMessage,
      averagePercentageForWeek,
      weekDates,
      percentages,
      visibleWeekDates,
      quoteIndex,
    ]
  );
}
