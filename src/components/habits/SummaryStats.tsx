import { useHabits } from "../../context/HabitContext";
import habitQuotes from "./habitQuotes";

export default function SummaryStats() {
  const { percentages, quoteIndex, weekDates } = useHabits();
  const strongestDay = Math.max(...percentages, 0);

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.8fr)]">
      <article className="rounded-[2rem] border border-white/70 bg-[rgba(242,249,249,0.8)] p-6 shadow-[0_18px_55px_rgba(80,111,122,0.1)] backdrop-blur-xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7d929c]">
              Weekly check-ins
            </p>
            <h2 className="mt-2 font-['Sora'] text-[1.8rem] font-[500] text-[#101820]">
              Daily completion rhythm
            </h2>
          </div>
          <div className="rounded-full bg-white/75 px-4 py-2 text-sm font-medium text-[#1b2830]">
            Peak: {strongestDay}%
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-7">
          {weekDates.map((date, index) => (
            <div className="rounded-[1.5rem] bg-white/70 p-4" key={date.toISOString()}>
              <p className="text-xs uppercase tracking-[0.16em] text-[#8ca0a9]">
                {date.toLocaleDateString("en-US", { weekday: "long" })}
              </p>
              <p className="mt-3 text-3xl font-[300] text-[#101820]">
                {percentages[index]}%
              </p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#d9e8eb]">
                <div
                  className="h-full rounded-full bg-[#72e1ee]"
                  style={{ width: `${percentages[index]}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[#161c22] p-6 text-white shadow-[0_22px_60px_rgba(18,24,29,0.2)]">
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 h-44 w-44 rounded-full bg-[#72e1ee]/20 blur-3xl"
        />
        <p className="relative text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
          Reflection
        </p>
        <p className="relative mt-4 font-['Sora'] text-[1.8rem] font-[500] leading-tight">
          Small wins stay visible.
        </p>
        <p className="relative mt-4 text-sm leading-7 text-white/74">
          {habitQuotes[quoteIndex]}
        </p>
      </article>
    </section>
  );
}
