import { useHabits } from "../../context/HabitContext";
import { EmptyState, Skeleton } from "../ui";

const HABIT_SKELETON_IDS = ["habit-alpha", "habit-beta", "habit-gamma"] as const;

function HabitWidgetSkeleton() {
    return (<div>
      <Skeleton className="h-6 w-24" />
      <div>
        {HABIT_SKELETON_IDS.map((id) => (<Skeleton key={id} className="mt-3 h-10 w-full"/>))}
      </div>
    </div>);
}
function HabitWidget() {
    const { habits, isLoading } = useHabits();
    if (isLoading) {
        return <HabitWidgetSkeleton />;
    }
    return (<div>
      <div>
        <p>
          Momentum
        </p>
        <p>
          Today&apos;s habits
        </p>
        <p>Keep the repeatable wins visible.</p>
      </div>

      {habits.length > 0 ? (<ul>
          {habits.map((habit) => (<li key={habit.id}>
              {habit.name}
            </li>))}
        </ul>) : (<EmptyState description="Add habits on the Habits page to see them here." title="No habits yet"/>)}
    </div>);
}
export default HabitWidget;
