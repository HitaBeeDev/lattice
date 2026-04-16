import type { Habit } from "../types/habit";

interface WeekDate {
  dayFull: string;
}

/**
 * Counts habits whose weekly day marks are fully completed.
 */
export const calculateCompletedHabitsCount = (habits: Habit[]): number =>
  habits.filter((habit) => habit.days.every((day) => day)).length;

/**
 * Counts how many habits are marked complete for each weekday in the current week.
 */
export const calculateDayCompletionStatus = (habits: Habit[]): number[] => {
  const dayCompletionStatus = Array(7).fill(0) as number[];
  habits.forEach((habit) => {
    habit.days.forEach((day, index) => {
      if (day) {
        dayCompletionStatus[index]++;
      }
    });
  });
  return dayCompletionStatus;
};

/**
 * Returns the full weekday label with the highest completion count.
 */
export const findBestDayIndex = (
  dayCompletionStatus: number[],
  weekDates: WeekDate[]
): string =>
  weekDates[dayCompletionStatus.indexOf(Math.max(...dayCompletionStatus))]
    ?.dayFull ?? "N/A";

interface BestHabitResult {
  habit: Habit | null;
  completionPercentage: number;
}

/**
 * Returns the habit with the highest weekly completion percentage.
 */
export const findBestHabit = (habits: Habit[]): BestHabitResult =>
  habits.reduce<BestHabitResult>(
    (best, habit) => {
      const numOfMarkedBoxes = habit.days.filter((day) => day === true).length;
      const completionPercentage = Math.ceil((numOfMarkedBoxes / 7) * 100);
      if (completionPercentage > best.completionPercentage) {
        return { habit, completionPercentage };
      }
      return best;
    },
    { habit: null, completionPercentage: -1 }
  );

/**
 * Calculates the average daily completion percentage across the week.
 */
export const calculateAveragePercentage = (habits: Habit[]): number => {
  const sumPercentageOfDay = Array(7).fill(0) as number[];
  habits.forEach((habit) => {
    habit.days.forEach((day, index) => {
      if (day) {
        sumPercentageOfDay[index] += Math.ceil((1 / habits.length) * 100);
      }
    });
  });

  return Math.ceil(sumPercentageOfDay.reduce((acc, curr) => acc + curr, 0) / 7);
};

/**
 * Calculates the combined weekly score derived from the average completion percentage.
 */
export const calculateTotalScoreOfWeek = (habits: Habit[]): number => {
  const averagePercentage = calculateAveragePercentage(habits);
  return Math.ceil(
    (averagePercentage + calculateAveragePercentage(habits)) / 2
  );
};
