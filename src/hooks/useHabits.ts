import { useEffect, useMemo, useState, ChangeEvent } from "react";
import usePersistentState from "./usePersistentState";
import habitQuotes from "../components/habits/habitQuotes";

export interface HabitEntry {
  id: string;
  name: string;
  days: boolean[];
}

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "short",
  day: "2-digit",
  month: "short",
};

const DAY_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = { weekday: "short" };

export function useHabits() {
  const [habitInput, setHabitInput] = useState("");
  const [habits, setHabits] = usePersistentState<HabitEntry[]>("habits", []);
  const [editIndex, setEditIndex] = useState(-1);
  const [editInput, setEditInput] = useState("");
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % habitQuotes.length);
    }, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isLargeScreen = windowWidth >= 1024;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHabitInput(e.target.value);
  };

  const handleAddClick = () => {
    if (!habitInput) return;
    const id = `habit-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    setHabits([...habits, { id, name: habitInput, days: Array(7).fill(false) }]);
    setHabitInput("");
  };

  const handleEditClick = (index: number) => {
    setEditIndex(index);
    setEditInput(habits[index].name);
  };

  const handleSaveClick = () => {
    const updatedHabits = [...habits];
    updatedHabits[editIndex] = {
      ...updatedHabits[editIndex],
      name: editInput,
    };
    setHabits(updatedHabits);
    setEditIndex(-1);
  };

  const handleCancelClick = () => {
    setEditIndex(-1);
  };

  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditInput(e.target.value);
  };

  const handleDeleteClick = (index: number) => {
    setHabits(habits.filter((_, i) => i !== index));
  };

  const toggleDayMark = (habitIndex: number, dayIndex: number) => {
    const updatedHabits = habits.map((habit, i) => {
      if (i !== habitIndex) return habit;
      const updatedDays = [...habit.days];
      updatedDays[dayIndex] = !updatedDays[dayIndex];
      return { ...habit, days: updatedDays };
    });
    setHabits(updatedHabits);
  };

  const getWeekDates = (): Date[] => {
    const today = new Date();
    const currentDay = today.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    const dates: Date[] = [monday];
    for (let i = 1; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatDate = (date: Date): string =>
    new Intl.DateTimeFormat("en-US", DATE_FORMAT_OPTIONS).format(date);

  const formatDayOfWeek = (date: Date): string =>
    new Intl.DateTimeFormat("en-US", DAY_FORMAT_OPTIONS).format(date);

  const calculateHabitCompletion = () => {
    const totalHabits = habits.length;
    const completedHabits = habits.filter((habit) =>
      habit.days.every((day) => day)
    ).length;
    return { totalHabits, completedHabits };
  };

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
      ? `Keep up the great work! Your best habits this week: ${bestHabits.map((h) => h.name).join(", ")}. `
      : "No habits with 100% completion this week. Don't worry, there's always room for improvement!";

  const calculateAveragePercentageForWeek = (): number => {
    const total = percentages.reduce((sum, p) => sum + p, 0);
    return Math.round(total / 7);
  };

  const averagePercentageForWeek = calculateAveragePercentageForWeek();

  const visibleWeekDates = isLargeScreen ? weekDates : [new Date()];

  return useMemo(
    () => ({
      habits,
      editIndex,
      editInput,
      habitInput,
      handleInputChange,
      handleAddClick,
      handleEditClick,
      handleSaveClick,
      handleCancelClick,
      handleEditInputChange,
      handleDeleteClick,
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
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [habits, habitInput, editIndex, editInput, quoteIndex, windowWidth]
  );
}
