import type { Habit } from "../../types/habit";
import { CheckIcon, FlameIcon } from "./dashboardIcons";
import { Button, Tooltip } from "../ui";

type DailyHabitsCardProps = {
  habits: Habit[];
  todayIndex: number;
  toggleDayMark: (habitIndex: number, dayIndex: number) => void;
};

type DailyHabitItemProps = {
  habit: Habit;
  onToggle: () => void;
  todayIndex: number;
};

function DailyHabitItem({ habit, onToggle, todayIndex }: DailyHabitItemProps) {
  const isDone = Boolean(habit.days[todayIndex]);

  return (
    <li>
      <button
        className="flex w-full items-center justify-between rounded-[1.35rem] border border-black/5 bg-white/60 px-3 py-3 text-sm transition hover:border-black/10 hover:bg-white"
        onClick={onToggle}
        type="button"
      >
        <span className="flex items-center gap-3">
          <span
            className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition ${
              isDone
                ? "border-emerald-500 bg-emerald-500 text-white"
                : "border-slate-300 bg-white"
            }`}
          >
            {isDone && <CheckIcon />}
          </span>
          <span className={isDone ? "font-medium text-slate-500 line-through" : "font-medium text-slate-700"}>
            {habit.name}
          </span>
        </span>
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <FlameIcon />
          {habit.days.filter(Boolean).length}
        </span>
      </button>
    </li>
  );
}

export default function DailyHabitsCard({
  habits,
  todayIndex,
  toggleDayMark,
}: DailyHabitsCardProps) {
  return (
    <article className="app-card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Consistency</p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-950">
            Daily habits
          </h2>
        </div>
        <Tooltip content="More habit actions coming soon">
          <Button aria-label="More habit actions" size="sm" variant="ghost">
            &hellip;
          </Button>
        </Tooltip>
      </div>

      <ul className="-mx-1 space-y-0.5">
        {habits.length > 0 ? (
          habits.map((habit, index) => (
            <DailyHabitItem
              key={habit.id}
              habit={habit}
              onToggle={() => toggleDayMark(index, todayIndex)}
              todayIndex={todayIndex}
            />
          ))
        ) : (
          <li className="py-4 text-center text-sm text-slate-500">
            No habits for today.
          </li>
        )}
      </ul>
    </article>
  );
}
