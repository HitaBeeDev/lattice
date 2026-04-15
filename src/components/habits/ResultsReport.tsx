import { useHabits } from "../../context/HabitContext";

function ResultsReport() {
  const {
    totalHabits,
    completedHabits,
    bestDayMessage,
    bestHabitMessage,
    averagePercentageForWeek,
  } = useHabits();

  const overviewMessage =
    completedHabits === 0
      ? "No habits are fully completed yet, which is fine. The page is set up to help the next check-in feel obvious."
      : `You have ${completedHabits} fully completed habit${completedHabits === 1 ? "" : "s"} out of ${totalHabits} this week.`;

  const averageTone =
    averagePercentageForWeek >= 75
      ? "Fantastic job. Your week is landing with real consistency."
      : averagePercentageForWeek >= 50
        ? "Solid pace. The baseline is forming."
        : averagePercentageForWeek >= 25
          ? "Progress is visible. Keep reducing friction."
          : "The system is still warming up. Keep the next action small.";

  return (
    <section aria-labelledby="habit-results-heading">
      <header className="mb-4">
        <h2
          className="font-['Sora'] text-[1.8rem] font-[500] text-[#101820]"
          id="habit-results-heading"
        >
          Habit results report
        </h2>
      </header>

      <div className="grid gap-4 lg:grid-cols-4">
        <article className="rounded-[1.7rem] border border-white/70 bg-white/70 p-5 shadow-[0_18px_45px_rgba(80,111,122,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7d929c]">
            Overview
          </p>
          <p className="mt-3 text-sm leading-7 text-[#4d636e]">
            {overviewMessage}
          </p>
        </article>

        <article className="rounded-[1.7rem] border border-white/70 bg-white/70 p-5 shadow-[0_18px_45px_rgba(80,111,122,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7d929c]">
            Best habits
          </p>
          <p className="mt-3 text-sm leading-7 text-[#4d636e]">
            {bestHabitMessage}
          </p>
        </article>

        <article className="rounded-[1.7rem] border border-white/70 bg-white/70 p-5 shadow-[0_18px_45px_rgba(80,111,122,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7d929c]">
            Best day
          </p>
          <p className="mt-3 text-sm leading-7 text-[#4d636e]">
            {bestDayMessage}
          </p>
        </article>

        <article className="rounded-[1.7rem] border border-white/70 bg-[#72e1ee]/45 p-5 shadow-[0_18px_45px_rgba(80,111,122,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4b6670]">
            Average
          </p>
          <p className="mt-3 text-4xl font-[300] text-[#101820]">
            {averagePercentageForWeek.toFixed(0)}%
          </p>
          <p className="mt-3 text-sm leading-7 text-[#3d5964]">
            {averageTone}
          </p>
        </article>
      </div>
    </section>
  );
}

export default ResultsReport;
