import { useHabits } from "../../context/HabitContext";
import { EmptyState, Skeleton } from "../ui";

function HabitWidgetSkeleton() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <Skeleton className="mb-4 h-5 w-32" />
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-8 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function HabitWidget() {
  const { habits, isLoading } = useHabits();

  if (isLoading) {
    return <HabitWidgetSkeleton />;
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4">
        <p className="text-lg font-semibold text-slate-900">Today&apos;s Habits</p>
        <p className="mt-0.5 text-sm text-slate-500">Keep up the amazing momentum!</p>
      </div>

      {habits.length > 0 ? (
        <ul className="space-y-2">
          {habits.map((habit) => (
            <li
              key={habit.id}
              className="rounded-xl bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700"
            >
              {habit.name}
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          description="Add habits on the Habits page to see them here."
          title="No habits yet"
        />
      )}
    </div>
  );
}

export default HabitWidget;
