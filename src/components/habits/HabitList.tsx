import { useHabits } from "../../context/HabitContext";
import HabitRow from "./HabitRow";
import { EmptyState } from "../ui";

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
        description="Looks like you haven&apos;t added any habits yet. Start by creating one small routine you want to keep this week."
        title="No habits yet"
      />
    );
  }

  return (
    <section aria-label="Habit list" className="space-y-3">
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
    </section>
  );
}
