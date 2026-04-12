import { useHabits } from "../../context/HabitContext";
import habitQuotes from "./habitQuotes";

export default function SummaryStats() {
  const { percentages, quoteIndex, weekDates } = useHabits();

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,0.9fr)]">
      <article className="app-card">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
            Weekly check-ins
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
            Daily completion rhythm
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {weekDates.map((date, index) => (
            <div
              key={date.toISOString()}
              className="rounded-[1.5rem] border border-black/5 bg-white/60 p-4"
            >
              <p className="text-xs uppercase tracking-[0.22em] text-slate-600">
                {date.toLocaleDateString("en-US", { weekday: "short" })}
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-950">
                {percentages[index]}%
              </p>
            </div>
          ))}
        </div>
      </article>

      <article className="app-panel-dark relative overflow-hidden p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(217,242,71,0.22),_transparent_22%)]"
        />
        <p className="relative text-xs font-semibold uppercase tracking-[0.22em] text-[var(--app-accent)]">
          Reflection
        </p>
        <p className="relative mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">
          Small wins stay visible.
        </p>
        <p className="relative mt-4 text-sm leading-7 text-white/85">
          {habitQuotes[quoteIndex]}
        </p>
      </article>
    </section>
  );
}
