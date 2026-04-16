import { useMemo } from "react";
import { useHabits } from "../../context/HabitContext";
import { buildMockHabitHeatmapEntries } from "../../lib/mockHabitHeatmap";
import HabitConsistencyCard from "./HabitConsistencyCard";

const getLocalIsoDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function LazyHabitConsistencyCard(): JSX.Element {
  const { habits, weekDates } = useHabits();

  const entries = useMemo(() => {
    const generated = buildMockHabitHeatmapEntries();

    if (habits.length === 0) {
      return generated;
    }

    const totalHabits = habits.length;
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

      return { ...entry, completedHabits, totalHabits };
    });
  }, [habits, weekDates]);

  return <HabitConsistencyCard entries={entries} />;
}
