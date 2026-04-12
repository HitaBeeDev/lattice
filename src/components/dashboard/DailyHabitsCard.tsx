import type { HabitEntry } from "../../db/database";
import { CheckIcon, FlameIcon } from "./dashboardIcons";
import Button from "../ui/Button";
import Tooltip from "../ui/Tooltip";

type DailyHabitsCardProps = {
  habits: HabitEntry[];
  todayIndex: number;
  toggleDayMark: (habitIndex: number, dayIndex: number) => void;
};

type DailyHabitItemProps = {
  habit: HabitEntry;
  onToggle: () => void;
  todayIndex: number;
};

function DailyHabitItem({ habit, onToggle, todayIndex }: DailyHabitItemProps) {
  const isDone = Boolean(habit.days[todayIndex]);

  return (
    <li>
      <button onClick={onToggle} type="button">
        <span>
          <span>{isDone && <CheckIcon />}</span>
          <span>{habit.name}</span>
        </span>
        <span>
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
    <article>
      <div className="mb-4 flex items-center justify-between">
        <h2>Daily Habits</h2>
        <Tooltip content="More habit actions coming soon">
          <Button size="sm" variant="ghost">...</Button>
        </Tooltip>
      </div>

      <ul>
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
          <li>No habits for today.</li>
        )}
      </ul>
    </article>
  );
}
