import { useHabits } from "../../context/HabitContext";
import { EmptyState } from "../ui";
import HabitRow from "./HabitRow";

export default function HabitList() {
  const {
    habits,
    editingHabitId,
    startEdit,
    saveEdit,
    cancelEdit,
    deleteHabit,
    toggleDayMark,
    visibleWeekDates,
  } = useHabits();

  const allHabitNames = habits.map((h) => h.name);

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
    <div className="-mt-5">
      {habits.map((habit) => (
        <HabitRow
          key={habit.id}
          habit={habit}
          isEditing={editingHabitId === habit.id}
          allHabitNames={allHabitNames}
          visibleWeekDates={visibleWeekDates}
          onStartEdit={startEdit}
          onSaveEdit={saveEdit}
          onCancelEdit={cancelEdit}
          onDelete={deleteHabit}
          onToggleDay={toggleDayMark}
        />
      ))}
    </div>
  );
}
