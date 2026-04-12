import { useHabits } from "../../context/HabitContext";

export default function WeekDaysHeader() {
  const { formatDate, visibleWeekDates } = useHabits();

  return (
    <section className="app-card overflow-x-auto">
      <div className="min-w-[840px]">
        <div className="grid grid-cols-[minmax(16rem,1fr)_repeat(7,minmax(2.5rem,1fr))_auto_auto_10rem] gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
              Your habits
            </p>
          </div>

          {visibleWeekDates.map((date) => (
            <div key={date.toISOString()} className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                {formatDate(date)}
              </p>
            </div>
          ))}

          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              Edit
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              Delete
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              Progress
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
