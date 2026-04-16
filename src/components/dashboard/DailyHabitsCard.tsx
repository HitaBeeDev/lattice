import type { Habit } from "../../types/habit";
import { CheckIcon, FlameIcon } from "./dashboardIcons";
import { Button, Tooltip } from "../ui";
type DailyHabitsCardProps = {
    habits: Habit[];
    todayIndex: number;
    toggleDayMark: (habitId: string, dayIndex: number) => void;
};
type DailyHabitItemProps = {
    habit: Habit;
    onToggle: () => void;
    todayIndex: number;
};
function DailyHabitItem({ habit, onToggle, todayIndex }: DailyHabitItemProps) {
    const isDone = Boolean(habit.days[todayIndex]);
    return (<li>
      <button onClick={onToggle} type="button">
        <span>
          <span>
            {isDone && <CheckIcon />}
          </span>
          <span>
            {habit.name}
          </span>
        </span>
        <span>
          <FlameIcon />
          {habit.days.filter(Boolean).length}
        </span>
      </button>
    </li>);
}
export default function DailyHabitsCard({ habits, todayIndex, toggleDayMark, }: DailyHabitsCardProps) {
    return (<article>
      <div>
        <div>
          <p>Habits</p>
          <h2>
            Today
          </h2>
        </div>
        <Tooltip content="More habit actions coming soon">
          <Button aria-label="More habit actions" size="sm" variant="ghost">
            &hellip;
          </Button>
        </Tooltip>
      </div>

      <ul>
        {habits.length > 0 ? (habits.map((habit) => (<DailyHabitItem key={habit.id} habit={habit} onToggle={() => toggleDayMark(habit.id, todayIndex)} todayIndex={todayIndex}/>))) : (<li>No habits yet.</li>)}
      </ul>
    </article>);
}
