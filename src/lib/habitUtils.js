// Count habits with all days marked
export const calculateCompletedHabitsCount = (habits) =>
  habits.filter((habit) => habit.days.every((day) => day)).length;

// Calculate completion status for each day
export const calculateDayCompletionStatus = (habits) => {
  const dayCompletionStatus = Array(7).fill(0);
  habits.forEach((habit) => {
    habit.days.forEach((day, index) => {
      if (day) {
        dayCompletionStatus[index]++;
      }
    });
  });
  return dayCompletionStatus;
};

// Find the index of the day with the highest completion status
export const findBestDayIndex = (dayCompletionStatus, weekDates) =>
  weekDates[dayCompletionStatus.indexOf(Math.max(...dayCompletionStatus))]
    ?.dayFull || "N/A";

// Find the habit with the highest completion percentage
export const findBestHabit = (habits) =>
  habits.reduce(
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

// Calculate the average completion percentage for each day
export const calculateAveragePercentage = (habits) => {
  const sumPercentageOfDay = Array(7).fill(0);
  habits.forEach((habit) => {
    habit.days.forEach((day, index) => {
      if (day) {
        sumPercentageOfDay[index] += Math.ceil((1 / habits.length) * 100);
      }
    });
  });

  return Math.ceil(sumPercentageOfDay.reduce((acc, curr) => acc + curr, 0) / 7);
};

// Calculate the total score of the week
export const calculateTotalScoreOfWeek = (habits) => {
  const averagePercentage = calculateAveragePercentage(habits);
  return Math.ceil(
    (averagePercentage + calculateAveragePercentage(habits)) / 2
  );
};
