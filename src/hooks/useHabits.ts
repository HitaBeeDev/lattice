import { useCallback, useEffect, useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import habitQuotes from "../components/habits/habitQuotes";
import { db } from "../db/database";
import type { Habit } from "../types/habit";
import { useRandomIndex } from "./useRandomIndex";

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "short",
  day: "2-digit",
  month: "short",
};

const DAY_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = { weekday: "short" };
const DAYS_PER_WEEK = 7;
const LARGE_SCREEN_BREAKPOINT = 1024;
const DEFAULT_HABIT_TARGET = 7;

export interface HabitCompletionStats {
  totalHabits: number;
  completedHabits: number;
}

export interface HabitContextValue {
  habits: Habit[];
  isLoading: boolean;
  editIndex: number;
  addHabit: (name: string) => void;
  startEdit: (index: number) => void;
  saveEdit: (index: number, name: string) => void;
  cancelEdit: () => void;
  deleteHabit: (index: number) => void;
  toggleDayMark: (habitIndex: number, dayIndex: number) => void;
  getWeekDates: () => Date[];
  formatDate: (date: Date) => string;
  formatDayOfWeek: (date: Date) => string;
  calculateHabitCompletion: () => HabitCompletionStats;
  calculateAveragePercentageForWeek: () => number;
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

const createHabitRecord = (name: string): Habit => {
  const timestamp = new Date().toISOString();

  return {
    id: `habit-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    name: name.trim(),
    days: Array(DAYS_PER_WEEK).fill(false),
    category: "other",
    targetPerWeek: DEFAULT_HABIT_TARGET,
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
  const [editIndex, setEditIndex] = useState<number>(-1);
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

  const isLargeScreen = windowWidth >= LARGE_SCREEN_BREAKPOINT;

  const addHabit = useCallback((name: string): void => {
    void db.habits.add(createHabitRecord(name));
  }, []);

  const startEdit = useCallback((index: number): void => {
    setEditIndex(index);
  }, []);

  const saveEdit = useCallback((index: number, name: string): void => {
    const habit = habits[index];
    if (!habit) {
      return;
    }

    void db.habits.put({
      ...habit,
      name: name.trim(),
      updatedAt: new Date().toISOString(),
    });
    setEditIndex(-1);
  }, [habits]);

  const cancelEdit = useCallback((): void => {
    setEditIndex(-1);
  }, []);

  const deleteHabit = useCallback((index: number): void => {
    const habit = habits[index];
    if (!habit) {
      return;
    }

    void db.habits.delete(habit.id);
  }, [habits]);

  const toggleDayMark = useCallback((habitIndex: number, dayIndex: number): void => {
    const habit = habits[habitIndex];
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

  const weekDates = getWeekDates();
  const today = new Date();
  const formattedToday = formatDate(today);
  const { totalHabits, completedHabits } = calculateHabitCompletion();

  const totalHabitsCount = habits.length;
  const markedHabitsArray = weekDates.map(
    (_, index) => habits.filter((habit) => habit.days[index]).length
  );
  const percentages = markedHabitsArray.map((markedHabits) =>
    totalHabitsCount !== 0
      ? Math.round((markedHabits / totalHabitsCount) * 100)
      : 0
  );

  const bestDays: string[] = [];
  percentages.forEach((percentage, index) => {
    if (percentage === 100) {
      bestDays.push(formatDayOfWeek(weekDates[index]));
    }
  });

  const bestDayMessage =
    bestDays.length > 0
      ? bestDays.length === 1
        ? `Hooray! Your best day of the week was: ${bestDays[0]}`
        : `Yay! Your best days of the week were: ${bestDays.join(", ")}`
      : "Oops! It seems like you haven't completed any day 100%. Don't worry, there's always tomorrow!";

  const bestHabits = habits.filter((habit) => habit.days.every((day) => day));

  const bestHabitMessage =
    bestHabits.length > 0
      ? `Keep up the great work! Your best habits this week: ${bestHabits.map((habit) => habit.name).join(", ")}. `
      : "No habits with 100% completion this week. Don't worry, there's always room for improvement!";

  const calculateAveragePercentageForWeek = useCallback((): number => {
    const totalPercentage = percentages.reduce((sum, percentage) => sum + percentage, 0);
    return Math.round(totalPercentage / DAYS_PER_WEEK);
  }, [percentages]);

  const averagePercentageForWeek = calculateAveragePercentageForWeek();
  const visibleWeekDates = isLargeScreen ? weekDates : [new Date()];

  return {
    habits,
    isLoading: habitEntries === undefined,
    editIndex,
    addHabit,
    startEdit,
    saveEdit,
    cancelEdit,
    deleteHabit,
    toggleDayMark,
    getWeekDates,
    formatDate,
    formatDayOfWeek,
    calculateHabitCompletion,
    calculateAveragePercentageForWeek,
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
  };
}
