import { useHabits } from "../../context/HabitContext";
import { EmptyState, Skeleton } from "../ui";

function HabitWidgetSkeleton() {
  return (
    <div className="app-card">
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
    <div className="app-card">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
          Momentum
        </p>
        <p className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-950">
          Today&apos;s habits
        </p>
        <p className="mt-1 text-sm text-slate-600">Keep the repeatable wins visible.</p>
      </div>

      {habits.length > 0 ? (
        <ul className="space-y-2">
          {habits.map((habit) => (
            <li
              key={habit.id}
              className="rounded-[1.35rem] border border-black/5 bg-white/55 px-4 py-3 text-sm font-medium text-slate-700"
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
