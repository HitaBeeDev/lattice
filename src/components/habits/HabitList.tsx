import { useHabits } from "../../context/HabitContext";
import { EmptyState } from "../ui";
import HabitRow from "./HabitRow";

export default function HabitList() {
  const {
    habits,
    editIndex,
    startEdit,
    saveEdit,
    cancelEdit,
    deleteHabit,
    toggleDayMark,
    visibleWeekDates,
  } = useHabits();

  if (habits.length === 0) {
    return (
      <EmptyState
        className="rounded-[2rem] border border-dashed border-white/80 bg-white/45 px-6 py-12 shadow-[0_18px_55px_rgba(80,111,122,0.08)]"
        description="Looks like you haven't added any habits yet. Start by creating one small routine you want to keep this week."
        title="No habits yet"
      />
    );
  }

  return (
    <section aria-label="Habit list" className="space-y-4">
      <div className="space-y-4">
        {habits.map((habit, index) => (
          <HabitRow
            key={habit.id}
            editIndex={editIndex}
            habit={habit}
            habits={habits}
            index={index}
            startEdit={startEdit}
            saveEdit={saveEdit}
            cancelEdit={cancelEdit}
            deleteHabit={deleteHabit}
            toggleDayMark={toggleDayMark}
            visibleWeekDates={visibleWeekDates}
          />
        ))}
      </div>
    </section>
  );
}
