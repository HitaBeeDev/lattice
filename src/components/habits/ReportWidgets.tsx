import { useHabits } from "../../context/HabitContext";

function ReportWidgets() {
  const { averagePercentageForWeek, bestDayMessage, bestHabitMessage } =
    useHabits();

  const avgPct = averagePercentageForWeek;

  const performanceMessage = (() => {
    if (avgPct >= 75)
      return `Fantastic job! Your weekly average is ${avgPct.toFixed(0)}%. Keep up the amazing work — you're on fire!`;
    if (avgPct >= 50)
      return `Great work! Your weekly average is ${avgPct.toFixed(0)}%. You're doing well — keep pushing towards your goals!`;
    if (avgPct >= 25)
      return `Good effort! Your weekly average is ${avgPct.toFixed(0)}%. Remember, progress is progress — keep going!`;
    return `No worries! Your weekly average is ${avgPct.toFixed(0)}%. Building habits takes time — keep it up next week!`;
  })();

  return (
    <section className="grid gap-4 sm:grid-cols-3">
      <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-indigo-500">
          Weekly average
        </p>
        <p className="text-sm leading-relaxed text-slate-600">{performanceMessage}</p>
      </article>

      <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-emerald-500">
          Best day
        </p>
        <p className="text-sm leading-relaxed text-slate-600">{bestDayMessage}</p>
      </article>

      <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-500">
          Best habit
        </p>
        <p className="text-sm leading-relaxed text-slate-600">{bestHabitMessage}</p>
      </article>
    </section>
  );
}

export default ReportWidgets;
