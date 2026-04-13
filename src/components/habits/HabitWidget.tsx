import { useHabits } from "../../context/HabitContext";
import { EmptyState, Skeleton } from "../ui";
function HabitWidgetSkeleton() {
    return (<div>
      <Skeleton />
      <div>
        {[0, 1, 2].map((i) => (<Skeleton key={i}/>))}
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
