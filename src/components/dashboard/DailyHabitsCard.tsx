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
        className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition hover:bg-slate-50"
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
          <span className={isDone ? "font-medium text-slate-400 line-through" : "font-medium text-slate-700"}>
            {habit.name}
          </span>
        </span>
        <span className="flex items-center gap-1 text-xs text-slate-400">
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
    <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Daily Habits</h2>
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
          <li className="py-4 text-center text-sm text-slate-400">
            No habits for today.
          </li>
        )}
      </ul>
    </article>
  );
}
