import { useHabits } from "../../context/HabitContext";

export default function WeekDaysHeader() {
  const { formatDate, visibleWeekDates } = useHabits();

  return (
    <section className="rounded-[2rem] border border-white/70 bg-[rgba(242,249,249,0.8)] p-4 shadow-[0_18px_55px_rgba(80,111,122,0.1)] backdrop-blur-xl lg:p-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(220px,1.2fr)_repeat(7,minmax(72px,0.52fr))_120px_120px_180px]">
        <div className="rounded-[1.4rem] bg-white/70 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7d929c]">
            Your habits
          </p>
          <p className="mt-2 font-['Sora'] text-xl text-[#101820]">
            Weekly tracker
          </p>
        </div>

        {visibleWeekDates.map((date) => (
          <div
            className="hidden rounded-[1.4rem] bg-white/65 px-3 py-4 text-center lg:block"
            key={date.toISOString()}
          >
            <p className="text-xs uppercase tracking-[0.14em] text-[#8ca0a9]">
              {date.toLocaleDateString("en-US", { weekday: "short" })}
            </p>
            <p className="mt-2 text-sm font-medium text-[#1b2830]">
              {formatDate(date)}
            </p>
          </div>
        ))}

        <div className="hidden rounded-[1.4rem] bg-white/65 px-3 py-4 text-center lg:block">
          <p className="text-xs uppercase tracking-[0.14em] text-[#8ca0a9]">
            Edit
          </p>
        </div>

        <div className="hidden rounded-[1.4rem] bg-white/65 px-3 py-4 text-center lg:block">
          <p className="text-xs uppercase tracking-[0.14em] text-[#8ca0a9]">
            Delete
          </p>
        </div>

        <div className="hidden rounded-[1.4rem] bg-white/65 px-3 py-4 text-center lg:block">
          <p className="text-xs uppercase tracking-[0.14em] text-[#8ca0a9]">
            Progress
          </p>
        </div>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
        {visibleWeekDates.map((date) => (
          <div
            className="min-w-[108px] rounded-full bg-white/75 px-4 py-2"
            key={date.toISOString()}
          >
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#8ca0a9]">
              {date.toLocaleDateString("en-US", { weekday: "short" })}
            </p>
            <p className="text-sm font-medium text-[#1b2830]">
              {formatDate(date)}
            </p>
          </div>
        ))}

        <div className="min-w-[112px] rounded-full bg-white/75 px-4 py-2 text-sm font-medium text-[#1b2830]">
          Edit/Delete
        </div>
        <div className="min-w-[112px] rounded-full bg-white/75 px-4 py-2 text-sm font-medium text-[#1b2830]">
          Progress
        </div>
      </div>
    </section>
  );
}
