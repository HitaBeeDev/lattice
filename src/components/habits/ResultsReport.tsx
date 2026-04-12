import { useHabits } from "../../context/HabitContext";

function ResultsReport() {
  const {
    totalHabits,
    completedHabits,
    bestDayMessage,
    bestHabitMessage,
    averagePercentageForWeek,
  } = useHabits();

  return (
    <section aria-labelledby="habit-results-heading" className="grid gap-4 sm:grid-cols-2">
      <header className="sr-only">
        <h2 id="habit-results-heading">Habit results report</h2>
      </header>

      <article className="app-card">
        {completedHabits === 0
          ? "No habits done? No worries! Every day's a new start. We're with you. Let's begin together!"
          : `You've nailed ${completedHabits} out of ${totalHabits} habits! Your dedication is heartwarming. Keep it up!`}
      </article>

      <article className="app-card">
        {bestHabitMessage}
      </article>

      <article className="app-card">
        {bestDayMessage}
      </article>

      <article className="app-card sm:col-span-2">
        {averagePercentageForWeek >= 75 && averagePercentageForWeek <= 100 && (
          <p>
            Fantastic job! Your result of the week is:{" "}
            <span>{averagePercentageForWeek.toFixed(2)}%</span>. Keep up the amazing work,
            you&apos;re on fire!
          </p>
        )}

        {averagePercentageForWeek >= 50 && averagePercentageForWeek < 75 && (
          <p>
            Great work! Your result of the week is:{" "}
            <span>{averagePercentageForWeek.toFixed(2)}%</span>. You&apos;re doing well, keep
            pushing towards your goals!
          </p>
        )}

        {averagePercentageForWeek >= 25 && averagePercentageForWeek < 50 && (
          <p>
            Good effort! Your result of the week is:{" "}
            <span>{averagePercentageForWeek.toFixed(2)}%</span>. Remember, progress is progress,
            keep going!
          </p>
        )}

        {averagePercentageForWeek >= 0 && averagePercentageForWeek < 25 && (
          <p>
            No worries! Your result of the week is:{" "}
            <span>{averagePercentageForWeek.toFixed(2)}%</span>. Building habits takes time,
            you&apos;re doing great! Keep it up next week!
          </p>
        )}
      </article>
    </section>
  );
}

export default ResultsReport;
